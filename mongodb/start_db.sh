#!/bin/sh

cd `dirname $0`
mongod -config mongodb.yml
