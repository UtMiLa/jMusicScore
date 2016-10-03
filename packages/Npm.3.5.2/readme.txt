Npm 3.5.2
=========

Npm is a package manager for Node.js.


Installation overview
---------------------

Npm cmd is installed into .bin dir in your project, along with Node.js cmd. Git URLs are
handled by Nogit tool, so local Git is not required unless you use npm packages with Git
submodules.


Automation
----------

Use ".bin\npm" command to run Npm in your build scripts. For example, here is a simple
MsBuild target to restore Npm packages defined in package.json:

<Target Name="NpmInstall">
  <Exec Command=".bin\npm install" />
</Target>


Daily usage
-----------

If you add ".bin" to PATH environment variable, you can call "npm" directly from your
project root dir.

Note: if PATH was changed, restart your command prompt to refresh environment variables.


Proxy settings
--------------

If Npm should use a proxy for remote connections, set 'HTTP_PROXY' and/or 'HTTPS_PROXY'
environment variables to the proxy URL. For Node.js delivered via NuGet, edit
"~/.bin/node.cmd" file:
    
    SET HTTP_PROXY=http://1:1@127.0.0.1:8888
    SET HTTPS_PROXY=http://1:1@127.0.0.1:8888
    
where "http://1:1@127.0.0.1:8888" is the proxy at "127.0.0.1:8888" with username "1" and
password "1" used for authentication.


Docs
----

Read Npm docs at https://docs.npmjs.com/
Post Nuget package issues or contribute at https://github.com/whyleee/nuget-node-tools


------------------------------------------------------
© 2015 npm, Inc.