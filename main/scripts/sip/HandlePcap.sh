#!/bin/bash

# Verify that we have enough INVITE or REGISTERs
if [ "$(tshark -r "$2" -V -n 2>/dev/null | grep "Request-Line:" | grep "INVITE\|REGISTER" | wc -l)" -lt "4" ]
then
    echo "Invalid:Couldn't find INVITE/REGISTER"
    exit
fi

# GetPacketByChain flag (iIoO) filename
function GetPacketByChain {
# Might not be enough information, will change if needed
    Dec=$(printf '%x\n' "'$1")
    Res="$(tshark -r  "$2" -V -n 2>/dev/null | grep "Request-Line: INVITE" -B 60 -A 60 | grep "Destination: $Dec:" -A 100 | head -101)"
    if [ -z "$Res" ]
    then
        Res="$(tshark -r  "$2" -V -n 2>/dev/null | grep "Request-Line: REGISTER" -B 60 -A 60 | grep "Destination: $Dec" -A 100 | head -101)"
        echo "$Res"
    else
        echo "$Res"
    fi
}

# Format to use function: GenerateRule Protocol SourcePort DestinationPort
function GenerateRule {

    FinalSer="sip"
    FinalSer+="$(echo $1 | grep "TCP")"

    if [ "$2" -ne "$3" ]
    then
        FinalSer+="_dyn"
    fi

    if [ "$2" -ne "5060" ] && [ "$3" -ne "5060" ]
    then
        WhichVar="$(echo "5060" "$2" "$3" | tr ' ' '\n' | sort -n | grep "5060" -C 1 | grep -v "5060" | awk '{print (5060 - $1) ($2 - 5060)}' | sed 's/5060//g' | sed 's/\-//g' | nl | sort -k 2,2 | head -1 | awk '{print $1}' | tr 12 23)"
        FinalSer+=":${!WhichVar}"
    else
        FinalSer+=":5060"
    fi

    echo "$FinalSer"
}

# CheckTopology PcapFile Topology.elg
function CheckTopology {
    Packet="$(GetPacketByChain I $1)"

	SrcIP=$(echo "$Packet" | grep Source | grep '\.' | awk '{print $2}')
	DstIP=$(echo "$Packet" | grep Destination | grep '\.' | awk '{print $2}')

    SrcIPTop=$(./scripts/sip/CheckIP.sh $SrcIP $2)
    DstIPTop=$(./scripts/sip/CheckIP.sh $DstIP $2)

    if [ "$SrcIPTop" == "Invalid" ] || [ "$DstIPTop" == "Invalid" ]
    then
        FinalRes="Invalid:Parsing Error"
    fi

    if [[ $(echo $SrcIPTop | grep Enabled) ]] && [[ $(echo $DstIPTop | grep Enabled) ]]
    then
        if [[ $(echo $SrcIPTop | grep "Internal") ]] && [[ $(echo $DstIPTop | grep "External") ]]
        then
            FinalRes="Valid:Topology is Internal -> External"
        elif [[ $(echo $SrcIPTop | grep "External") ]] && [[ $(echo $DstIPTop | grep "Internal") ]]
        then
            FinalRes="Valid:Topology is External -> Internal"
        else
            FinalRes="Invalid:Topology is either Internal -> Internal or External -> External."
        fi
    else
        FinalRes="Invalid:Anti-Spoofing is not enabled."
    fi

    echo "$FinalRes"

}

# InitiateGrule filename
function InitiateGrule {
    Packet="$(GetPacketByChain i "$1")"

    # Get source and destination ports
    SrcPort=$(echo "$Packet" | grep "Source port" | awk '{print $3}')
    DstPort=$(echo "$Packet" | grep "Destination port" | awk '{print $3}')
    

    # Get protocol type
    Proto=$(echo "$Packet" | grep "Protocol:" | grep "UDP\|TCP" | awk '{print $2}')
    GenerateRule $Proto $SrcPort $DstPort
}

# CheckEarlyNAT FileName
function CheckEarlyNAT {
    iPacket="$(GetPacketByChain i $1)"
    IPacket="$(GetPacketByChain I $1)"
    oPacket="$(GetPacketByChain o $1)"
    OPacket="$(GetPacketByChain O $1)"

    iSrcPort=$(echo "$iPacket" | grep "Source port" | awk '{print $3}')
    ISrcPort=$(echo "$IPacket" | grep "Source port" | awk '{print $3}')
    oSrcPort=$(echo "$oPacket" | grep "Source port" | awk '{print $3}')
    OSrcPort=$(echo "$OPacket" | grep "Source port" | awk '{print $3}')
    DstPort=$(echo "$iPacket" | grep "Destination port" | awk '{print $3}')

    if [ $iSrcPort == $ISrcPort ]
    then
        echo "No Early NAT"
    elif [ $ISrcPort -ge 10000 ]
    then
        echo "Early NAT successful"
        echo "Translated from port" $iSrcPort "to port" $ISrcPort
        if [ $ISrcPort == $oSrcPort ]
        then
            echo "Entering outbound chain with valid early NAT"
            if [ $oSrcPort == $OSrcPort ]
            then
                echo "Traffic went out with early NAT"
                echo "Invalid"
            elif [ $OSrcPort == $iSrcPort ]
            then
                echo "Going out with same source port as coming in:" $OSrcPort
                if [ $iSrcPort == $DstPort ]
                then
                    echo "Same source and destination port:" $OSrcPort
                fi
            fi
        else
            echo "Failure between inbound chain and outbound chain - early NAT violated"
            echo "Invalid"
        fi
    else
        echo "Early NAT to port lower than 10000"
        echo "Not valid"
    fi
    echo
}

# PortChecks iPacket OPacket
function PortChecks {

    Chain="i"

    for c in "$@"
    do
        for i in "Request-URI Host Part" "SIP to address Host Part"
        do
            if [ -z "$(CompField "$c" "Destination" "$i")" ]
            then
                echo
                echo "Warning: Mismatch in chain "$Chain":"
                echo
                echo $(echo "$c" | grep "$i")
                echo
                echo echo $(echo "$c" | grep "Destination:" | grep "\.")
                echo
                echo
            fi
        done

        for i in "Sent-by Address" "Contact-URI Host Part"
        do
            if [ -z "$(CompField "$c" "Source" "$i")" ]
            then
                echo
                echo "Warning: Mismatch in chain "$Chain":"
                echo
                echo $(echo "$c" | grep "$i")
                echo
                echo $(echo "$c" | grep "Source:" | grep "\.")
                echo
                echo
            fi
        done

        for i in "Contact-URI Host Port" "Sent-by port"
        do
        if [ -z "$(CompField "$c" "Source port" "$i")" ]
        then
                echo
                echo "Warning: Mismatch in chain "$Chain":"
                echo
                echo $(echo "$c" | grep "$i")
                echo
                echo $(echo "$c" | grep "Source port:")
                echo
                echo
        fi
        done

        Chain="O"

    done

}

# PayloadChecks FileName NAT Topology
function PayloadChecks {

    iPacket="$(GetPacketByChain i $1)"
    IPacket="$(GetPacketByChain I $1)"
    oPacket="$(GetPacketByChain o $1)"
    OPacket="$(GetPacketByChain O $1)"

    if [ "$(CheckTopology $1 $3 | grep "External -> Internal")" ] && [ "${2,,}" == "hide" ] || [ "${2,,}" == "static" ]
    then
        for i in "Request-URI Host Part" "SIP to address Host Part"
        do
            # ValidateIP "$i" "$(echo "$OPacket" | grep "Destination:" | grep "\." | awk '{print $2}')" "$OPacket"
            if [ $(CheckFieldPKT "$i" "$oPacket" "$OPacket") ]
            then
                echo "No NAT on $i"
            else
                echo "$i NATed successfuly"
            fi
            echo
        done
        PortChecks "$iPacket" "$OPacket"
        echo "Checking RTP:"
        echo
        VerifyRTPIntToExt $1
    elif [ "$(CheckTopology $1 $3 | grep "Internal -> External")" ] && [ "${2,,}" == "hide" ] || [ "${2,,}" == "static" ]
    then
        for i in "Contact-URI Host Part" "Sent-by Address"
        do 
            # ValidateIP "$i" "$(echo "$OPacket" | grep "Source:" | grep "\." | awk '{print $2}')" "$OPacket"
            if [ $(CheckFieldPKT "$i" "$oPacket" "$OPacket") ]
            then
                echo "No NAT on $i"
            else
                echo "$i NATed successfuly"
            fi
            echo
        done
        PortChecks "$iPacket" "$OPacket"
        echo "Checking RTP:"
        echo
        VerifyRTPIntToExt $1
    else
        echo "Didn't intiate NAT check due to topology failure/No NAT is required."
    fi
}

# Example for function operation:
# Gets a packet, Source IP and Request-URI Host Part
# It will check if the value of Request-URI Host Part exists in the Source IP field

# CompField Packet Field MoreSpecifiedValue
function CompField {
    if [ "$(echo "$1" | grep "$2" | grep "$(echo "$1" | grep "$3" | cut -d ":" -f 2)")" ] 
    then
        echo 1
    fi 
}

# VerifyRTP FileName
function VerifyRTPIntToExt {
    for i in "i" "I" "o" "O"
    do
        AgreedMediaPort=$(GetPacketByChain $i $1 | grep "Media Description" | tr ' ' '\n' | grep audio -A 1 | grep -v audio)
        RTPMediaPortSrc=$(tshark -r $1 -V -n | grep "Real-Time" -B 10 | grep "Source port" -A 1 | awk '{print $3}')
        if [ -z "$RTPMediaPortSrc" ]
        then
            echo "No RTP connections detected"
            exit
        fi
        if [ "$(echo "$RTPMediaPortSrc" | grep -v "$AgreedMediaPort")" ]
        then
            RES+="error"
        fi
    done
    Whole="$(tshark -r $1 -V -n)"
    # This condition checks the RTP connection by the SSRC and verifies whether the source IP or destination IP were changed.
    # It's a bot complicated, can be replaced easily with something entirely else, no dependencies on this part of the code.
    if [ $(echo "$whole" | grep $(echo "$Whole" | grep "Synchronization" | awk '{print $4}' | head -1) | grep "Source:" | grep "\." | awk '{print $2}' | uniq -u | wc -l) -eq "0" ] && [ $(echo "$whole" | grep $(echo "$Whole" | grep "Synchronization" | awk '{print $4}' | head -1) | grep "Destination:" | grep "\." | awk '{print $2}' | uniq -u | wc -l) -eq "0" ]
    then
        echo "Note: No NAT was identified for some RTP connections."
        echo
    fi
    if [ $(echo $RES | grep "error") ]
    then
        echo "Identified RTP connections that are not running on the agreed Media Port: $AgreedMediaPort"
    else
        echo "All RTP connections are OK and running on agreed Media Port: $AgreedMediaPort"
    fi
}

# ValidateIP Fieldname RequiredIP Packet
function ValidateIP {
    Val=$(echo "$3" | grep "$1" | cut -d ":" -f 2 | sed 's/ //g')
    if [[ $Val =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]
    then
        if [ $2 != $Val ]
        then
            echo "Note: $1 Value is $Val, it should be $2"
            echo
        fi
    else
        echo "Note: $1 Value is $Val, please make sure it's resolved to $2"
        echo
    fi 
}

# CheckFieldPKT FieldName Packet1 Packet2
function CheckFieldPKT {
    TmpVarPacket1=$(echo "$2" | grep "$1" | cut -d ":" -f 2)
    TmpVarPacket2=$(echo "$3" | grep "$1" | cut -d ":" -f 2)
    if [ "$TmpVarPacket1" == "$TmpVarPacket2" ]
    then
        echo "success"
    fi
}

if [ $1 == "grule" ]
then
    InitiateGrule "$2"
elif [ $1 == "chktop" ]
then
    CheckTopology $2 $3
elif [ $1 == "chkenat" ]
then
    CheckEarlyNAT $2
elif [ $1 == "pyload" ]
then 
    PayloadChecks $2 $3 $4
fi