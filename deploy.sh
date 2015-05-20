#!/bin/bash

# yuidoc -C -t ~/src/yuidoc-theme-blue lib
yuidoc -C -c yuidoc.json
scp -r out/* mpk@mars:/srv/www/nosuchtype.com/lab/xflow-js-apidocs
