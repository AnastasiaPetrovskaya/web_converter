java -classpath $(echo ../../_schemacrawler/lib/*.jar | tr ' ' ':')  schemacrawler.tools.integration.spring.Main -context-file=context.xml -executable=executableForSchema -datasource=datasource
