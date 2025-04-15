#!/bin/bash
source ../../.env-local

mvn -Dmaven.test.skip=true install

source ../../.env-local && java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar ./target/ecommerce-service*.jar
