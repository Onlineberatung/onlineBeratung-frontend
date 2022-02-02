## Subdomains

For the SaaS project we need different subdomains for testing different themes (light and dark)
To test this approach on your local maschine you have to add 2 different subdomains to your hosts file.

Only `tenant1` and `tenant2` are allowed for entering the side via API / login / etc. -> CORS

for development add

-   127.0.0.1 tenant1.localhost
-   127.0.0.1 tenant2.localhost

to your `etc/hosts` file

(https://www.ithelps-digital.com/de/blog/webseiten/host-datei-aendern/)
