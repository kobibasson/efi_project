#!/bin/bash

# Gets IP and topology file and returns the relevant interface 

# success LineOfSuccess File
function success {
	echo $1
	echo -e "$(cat $2 | grep "$1" -A 100 | grep Address | head -1 | tr -d '\n')\c"
	cat $2 | grep "$1" -B 100 | grep ">" | tail -1
}

cat $2 | while read i
do
	if [[ $(echo $i | grep "\." | grep "-") ]]
	then
		#Translate IPs to decimal and check if it's range
		DecStart=$(echo $i | cut -d "-" -f 1 | tr . '\n' | awk '{s = s*256 + $1} END{print s}')
		DecEnd=$(echo $i | cut -d "-" -f 2 | tr . '\n' | awk '{s = s*256 + $1} END{print s}')
		DecIP=$(echo $1 | tr . '\n' | awk '{s = s*256 + $1} END{print s}')
		if [ "$DecIP" -ge "$DecStart" ] && [ "$DecIP" -le "$DecEnd" ]
		then
			success "$i" $2
		fi
	fi
done	
