const express = require("express");
const SSH2Promise = require("ssh2-promise");
const router = express();
const config = require("config");
const kali = require("scp2");

//Multer middleware
const upload = require("./multer");
const injectorUpload = upload.single("injector");

//SSH settings
const { ssh, sftp } = config.get("kali");

const shell = new SSH2Promise(ssh);

router.post("/", injectorUpload, (req, res) => {
  const localFile = "./uploads/" + req.file.filename;
  const gateway = req.body.gateway;
  (async () => {
    //Transfer pcap to kali machine
    await kali.scp(localFile, sftp, err => {
      if (err) {
        console.error(err);
        return res.status(400).end("Connectivity issue to ESX network");
      }
    });

    //Get local MAC address
    const smac = await shell.exec("cat /sys/class/net/eth1/address");

    //Send ARP => get MAC of destination gateway
    const arping =
      "arping -I eth1 -c 1 " + gateway + " | awk '{print $4}' | grep :";
    const gmac = await shell.exec(arping).catch(err => {
      if (err) {
        res.status(400).send("arping failed: " + err);
        return;
      }
    });

    if (!gmac) {
      return res.send(
        "GW IP not found. Make sure GW is on SEC_LABS_LAN1 and on 192.168.0.0/16 range"
      );
    }
    const tcprewrite =
      "tcprewrite --infile=" +
      localFile +
      " --outfile=inject.pcap --enet-dmac=" +
      gmac +
      " --enet-smac=" +
      smac +
      " --dlt=enet";

    const tcpreplay =
      "tcpreplay --intf1=eth1 -M 10 inject.pcap 2>&1 | tail -n +3 | awk '{print$1,$2,$3,$4,$5}'";
    //Send tcprewrite and tcpreplay
    shell.exec(tcprewrite).catch(() => {
      shell
        .exec(tcpreplay)
        .then(output => res.send(output))
        .catch(err => res.status(400).send(err));
    });
  })();
});

module.exports = router;
