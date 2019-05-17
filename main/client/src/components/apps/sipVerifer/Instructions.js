import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const spoofing = `[Expert@R80.20GW:0]# egrep -B1 $'ifindex|:ipaddr|\\(\\x22<[0-9]|has_addr_info|:monitor_only|:external' $FWDIR/state/local/FW1/local.set | sed 's/[\\x22\\t()<>]//g' | sed 's/--//g' | sed 'N;s/\\n:ipaddr6/ IPv6/;P;D' | sed '/IPv6/!s/://g' | sed 's/interface_topology/\\tCalculated Interface Topology/g' | sed '0,/ifindex 0/{/ifindex 0/d;}' | sed '/ifindex 0/q' | sed '/spoof\\|scan/d' | sed 's/has_addr_info true/\\tAddress Spoofing Protection: Enabled/g' | sed 's/has_addr_info false/\\tAddress Spoofing Protection: Disabled/g' | sed -e '/Prot/{n;d}' | sed 'N;s/\\nmonitor_only true/ (Detect Mode)/;P;D' | sed 'N;s/\\nmonitor_only false/ (Prevent Mode)/;P;D' | sed 'N;s/\\nexternal false/ - Internal Interface/;P;D' | sed 'N;s/\\nexternal true/ - External Interface/;P;D' | tac | sed '/ifindex 0/I,+2 d'| tac |sed '/ifindex/d' | sed 's/,/ -/g' | sed 'N;s/\\nipaddr/ >/;P;D' | sed '/ - /s/^ /\\t/' | egrep -C 9999 --color=auto $'>|IPv6|External|Disabled|Detect' > topology.txt`

const fwmonitor =
  '[Expert@R80.20GW:0]# fw monitor -e "host(sip_proxy), accept;" -o fwmon.pcap'

export default class Instructions extends Component {
  render() {
    return (
      <div className="sipVerifier">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="display-4 text-center">efi SIP Verifier</div>

              <p className="lead text-center">Easy SIP Troubleshooting</p>
              <p className="font-weight-bold">Instructions</p>
              <p style={{ fontFamily: 'Arial' }}>
                1) Provide the command below to customers in order to collect
                gateway's topology info:
              </p>
              <p style={{ fontFamily: 'courier' }}>{spoofing}</p>
              <p style={{ fontFamily: 'Arial' }}>
                2) Collect fw monitor capture filtering only on the SIP host:
              </p>
              <p style={{ fontFamily: 'courier' }}>{fwmonitor}</p>
              <Link to="/apps/sipverify">
                <button type="button" className="btn btn-info btn-block mt-4">
                  Go back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
