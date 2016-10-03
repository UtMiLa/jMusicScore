NoGit 0.1.0
===========

NoGit is a local git replacement for npm and bower, powered by js-git and Node.js.

This git tool contains only tiny subset of git features for npm and bower, so not for ordinary use.


Proxy settings
--------------

If NoGit should use a proxy for remote connections, use one of the next solutions:

 1) Set 'HTTP_PROXY' and/or 'HTTPS_PROXY' environment variables to the proxy URL. For Node.js
    delivered via NuGet, edit "~/.bin/node.cmd" file:
    
        SET HTTP_PROXY=http://1:1@127.0.0.1:8888
        SET HTTPS_PROXY=http://1:1@127.0.0.1:8888
    
    where "http://1:1@127.0.0.1:8888" is the proxy at "127.0.0.1:8888" with username "1" and
    password "1" used for authentication.
    
    Use this solution to set single proxy settings for all environments used in your project.
    This is a recommended solution, it will also force bower and npm to use the proxy.

 2) Add next lines to your local '%USERPROFILE%\.gitconfig' file:
 
        [http]
            proxy = http://1:1@127.0.0.1:8888
        [https]
            proxy = http://1:1@127.0.0.1:8888
    
    where "http://1:1@127.0.0.1:8888" is the proxy at "127.0.0.1:8888" with username "1" and
    password "1" used for authentication.
    
    Use this solution to set proxy settings for single environment only.

 3) If your proxy only doesn't allow 'git://' URLs, you can add next lines to your local
    '%USERPROFILE%\.gitconfig' file:

        [url "https://"]
            insteadOf = git://
    
    Then NoGit will use 'https://' URLs everywhere to work with remotes. Note, that for
    proxy settings in solutions 1) and 2), NoGit will also use 'https://' URLs everywhere.


Support
-------

Post issues and ideas to https://github.com/whyleee/nogit/issues.


------------------------------------------------------
© 2015 Pavel Nezhencev