{
	"multiselect": {
		"process": {
			  "wstlsd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/wstlsd.elg <br>fw_debug wstlsd on TDERROR_ALL_ALL=6 ",
				"debugEnd": "fw_debug wstlsd off TDERROR_ALL_ALL=0"
			  },
			  "fwd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/fwd.elg <br>fw_debug fwd on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug fwd off TDERROR_ALL_ALL=0"
			  },
			  "fwm": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/fwm.elg <br>fw_debug fwm on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug fwm off TDERROR_ALL_ALL=0"
			  },
			  "cpd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/cpd.elg <br>cpd_admin debug on TDERROR_ALL_ALL=5 ",
				"debugEnd": "cpd_admin debug off TDERROR_ALL_ALL=0"
			  },
			  "dlpu": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/dlpu.elg <br>fw_debug dlpu on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug dlpu off TDERROR_ALL_ALL=0"
			  },
			  "vpnd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/vpnd.elg <br>vpn debug trunc <br>vpn debug on TDERROR_ALL_ALL=5 ",
				"debugEnd": "vpn debug off <br>vpn debug ikeoff "
			  },
			  "pdpd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/pdpd.elg <br>pdp debug on <br>pdp d s all all ",
				"debugEnd": "pdp debug off "
			  },
			  "pepd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/pepd.elg <br>pep debug on <br>pep d s all all ",
				"debugEnd": "pep debug off "
			  },
			  "rad": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/rad.elg <br>rad_admin rad debug on all ",
				"debugEnd": "rad_admin rad debug off ALL "
			  },
			  "usrchkd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/usrchkd.elg <br>usrchk debug set all all ",
				"debugEnd": "usrchk debug off "
			  },
			  "mpdaemon": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $CPDIR/log/mpclient.elg*<br>echo \"Debug Started\" > $CPDIR/log/mpdaemon.elg*<br>mpclient debug set TDERROR_ALL_ALL=5<br>mpclient debug on",
				"debugEnd": "mpclient debug off"
			  },
			  "in.geod": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/in.geod.elg <br>fw_debug in.geod on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug in.geod off TDERROR_ALL_ALL=0 "
			  },
			  "in.emaild.mta": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/emaild.mta.elg <br>fw_debug in.emaild.mta on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug in.emaild.mta off TDERROR_ALL_ALL=0 "
			  },
			  "in.emaild.smtp": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/emaild.smtp.elg <br>fw_debug in.emaild.smtp on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug in.emaild.smtp off TDERROR_ALL_ALL=0 "
			  },
			  "wsdnsd": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/wsdnsd.elg <br>fw_debug wsdnsd on TDERROR_ALL_ALL=5 ",
				"debugEnd": "fw_debug wsdnsd off TDERROR_ALL_ALL=0 "
			  },
			  "ted": {
				"titleStart": "<br># User mode debugs",
				"titleStop": "<br># Stopping user mode debugs",
				"debugStart": "echo \"Debug Started\" > $FWDIR/log/ted.elg <br>tecli debug set TE all TE_IS all TE_CLOUD all<br>tecli debug on ",
				"debugEnd": "tecli debug off <br>tecli debug defaults "
			  }
			},
			
		"kernel": {
			  "Firewall": ["conn","drop","vm","tcpstr","xlate","xltrc","spii","aspii","cptls","cmi","ips","crypt","misp","sip","advp","nac","nat", "ftp", "mail", "content", "dlp", "packet", "user"],
			  "Blades": ["APPI + all","IDAPI + all","VPN + all","MALWARE + all","dlpk + all", "CI + all", "fg + all"],
			  "Services": ["WS + all","WSIS + all", "UC + all","CPAS + all","RAD_KERNEL + all", "CPRADK + all", "cmi_loader + all"],
			  "Rulebase": ["NRB + all","UP + all"]
			},

		"other": { 
			"tcpdump": {
				"displayName": "tcpdump",
				"titleStart": "<br># Traffic captures",
				"titleStop": "<br># Stopping traffic captures",
				"debugStart": "tcpdump -s 0 -eni any -w $DBGDIR/traffic.pcap &",
				"debugEnd": "jobs -p | xargs kill"
			},
			"fwmonitor": {
				"displayName": "fw monitor",
				"titleStart": "<br># Traffic captures",
				"titleStop": "<br># Stopping traffic captures",
				"debugStart": "fw monitor -e \"accept;\" -o $DBGDIR/fwmon.pcap &",
				"debugEnd": "jobs -p | xargs kill"
			},
			"fwaccel": {
				"displayName": "SecureXL off",
				"titleStart": "<br># Traffic captures",
				"titleStop": "<br># Stopping traffic captures",
				"debugStart": "fwaccel off",
				"debugEnd": "fwaccel on"
			},
			"nat": {
				"displayName": "NAT Cache off",
				"titleStart": "<br># Traffic captures",
				"titleStop": "<br># Stopping traffic captures",
				"debugStart": "fw ctl set int fwx_do_nat_cache 0",
				"debugEnd": "fw ctl set int fwx_do_nat_cache 1"
			},
			"cn_cache": {
				"displayName": "Delete server CN cache",
				"titleStart": "<br># Traffic captures",
				"titleStop": "<br># Stopping traffic captures",
				"debugStart": "fw tab -t cptls_server_cn_cache -x -y",
				"debugEnd": "jobs -p | xargs kill"
			}
		}	
	},
	"messages" : {
		"kernel": {
			"titleStart": "<br># Kernel debug<br>fw ctl debug 0<br>fw ctl debug -buf 32768",
			"titleStop": "<br># Stopping kernel debug<br>fw ctl debug 0",
			"kdebug": "fw ctl kdebug -T -f > $DBGDIR/kdebug.txt &",
			"kernelDebug": "fw ctl debug -m "
		},
		"misc": {
			"bashLine": "#!/bin/bash<br>",
			"scriptTitle": "### Check Point Debug Script ###",
			"replicateLine": "<br>echo 'Replicate the issue, press [ENTER] to stop'<br>read",
			"mkdirDebugFolder": "mkdir $DBGDIR<br>rm $DBGDIR/*",
			"DBGDIR": "<br>DBGDIR='/var/tmp/debug_files/'"
		}
	}
}