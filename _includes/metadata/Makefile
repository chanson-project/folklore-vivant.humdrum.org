##
## Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
## Creation Date: Thu Jun  8 19:45:08 PDT 2023
## Last Modified: Thu Jun  8 19:45:11 PDT 2023
## Syntax:        GNU Makefile
## Filename:      _includes/metadata/Makefile
## vim:           ts=3:nowrap
##
## Description: Download metadata for the 1520s project from the Google Spreadsheet
##              for the project's metadata.  You need to update the SID variable below
##              when the deployment of the Google Apps Script has changed.
##
##              Type "make" in this directory to download the JSON files for the metadata.
##
##              Google Spreadsheet metadata:
#		https://docs.google.com/spreadsheets/d/16E5ZaTv--7Ketd5Lpgcbk11aKRj9T2hDjjRUiRHiAOY/edit?gid=765727095#gid=765727095
##


#SID for 1520s Project Metadata
SID = AKfycbwGO6_cglQQ9cEbrk38h7U5ovmj_Se6v9IwQohdrvh8fvYSgiPYBJqoVRwUZ4JL53Kl

all: download

download: works sources

works:
	curl -L "https://script.google.com/macros/s/$(SID)/exec" > works.json

sources:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?type=sources" > sources.json


