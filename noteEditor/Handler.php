<?php

#print_r($_POST);
//$Lang = @$_GET['lang'];
if(isset($_POST['Data'])) {

/*

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
            }*/	
	
}
elseif(isset($_GET['Name'])) {
	$name = $_GET['Name'];
	$name = str_replace('\\', '', $name);
	$name = "C:\\tmp\\utmila\\" . $name;
	
	if (file_exists($name)) {
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header('Content-Disposition: attachment; filename='.basename($name));
		header('Expires: 0');
		header('Cache-Control: must-revalidate');
		header('Pragma: public');
		header('Content-Length: ' . (filesize($name) + 2));
		readfile($name);
		echo "\n";
	}
	else {
		header('Content-Type: text/plain');
		echo "NOT OK\n";
	}
}
else {
	header('Content-Type: text/plain');
	if ($handle = opendir("C:\\tmp\\utmila\\")) {
		while (false !== ($entry = readdir($handle))) {
			if ($entry != "." && $entry != "..") {
				echo utf8_encode ("$entry\n");
			}
		}
		closedir($handle);
	}
}
?>