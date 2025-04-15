#!/bin/bash
source ../../.env-local

mvn -Dmaven.test.skip=true install

java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar ./target/ecommerce-service*.jar
