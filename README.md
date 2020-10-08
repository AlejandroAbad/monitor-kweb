# monitor-kweb
Monitor de estado de K-Web de Knapp.

---

Esta aplicación hace de intermediaria entre las interfacez KWEB de los sistemas KNAPP y cualquier
frontend que requiera acceder al estado de los mismos.

```
 +--------------+
 | KWEB         |
 | ALICANTE     +-------KWEB----------+
 +--------------+                     |                    +---------------+
                                      |      +----REST-----+ SENTINEL      |
                                      v      |             +---------------+
 +--------------+            +---------------v+
 | KWEB         |            | MONITOR        |
 | SANTOMERA    +----KWEB--->+ KWEB           |
 +--------------+            +---------------^+            +---------------+
                                      ^      |             | FRONT-ENDS    |
                                      |      +----REST-----+               |
 +--------------+                     |                    | ...           |
 | KWEB         +--------KWEB---------+                    |               |
 | GRANDA       |                                          +---------------+
 +--------------+
```

Soporta las versiones 5 y 6 de Klass-X
