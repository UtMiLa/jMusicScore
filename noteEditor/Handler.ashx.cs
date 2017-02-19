using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace MinTypeScriptApplication
{
    /// <summary>
    /// Summary description for Handler
    /// </summary>
    public class Handler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.HttpMethod == "POST")
            {
                context.Response.ContentType = "text/plain";
                //context.Request.Unvalidated.Form
                string data = context.Request.Unvalidated.Form["Data"];
                string name = context.Request.Form["Name"];
                string b64 = context.Request.Unvalidated.Form["imgBase64"];
                if (!string.IsNullOrEmpty(name))
                {
                    name = @"C:\tmp\utmila\" + name;
                    if (!string.IsNullOrEmpty(b64))
                    {
                        byte[] newfile = Convert.FromBase64String(b64.Substring(b64.IndexOf(',') +1));
                        File.WriteAllBytes(name, newfile);
                    }
                    else 
                    try
                    {
                        StreamWriter fs = new StreamWriter(name);
                        using (fs)
                        {   
                            fs.Write(data);
                        }
                        context.Response.Write("OK");
                    }
                    catch (Exception)
                    {
                        context.Response.Write("NOT OK");
                    }
                }
                else
                {
                    context.Response.Write("NOT OK");
                }
            }
            else if (context.Request.HttpMethod == "GET") {
                string name = context.Request.QueryString["Name"];
                if (!string.IsNullOrEmpty(name))
                {
                    name = name.Replace("\\", "");
                    name = @"C:\tmp\utmila\" + name;
                    try
                    {
                        StreamReader fs = new StreamReader(name);
                        using (fs)
                        {
                            string data = fs.ReadToEnd();
                            context.Response.ContentType = "text/plain";
                            context.Response.Write(data);
                        }
                    }
                    catch (Exception)
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write("NOT OK");
                    }
                    
                }
                else {
                    var files = System.IO.Directory.EnumerateFiles(@"C:\tmp\utmila\");
                    context.Response.ContentType = "text/plain";
                    foreach (var file in files)
                    {
                        context.Response.Write(file.Substring(file.LastIndexOf("\\")+1));
                        context.Response.Write("\n");
                    }
                }
            }
            else
                {
                context.Response.ContentType = "text/plain";
                context.Response.Write("Hello World");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}