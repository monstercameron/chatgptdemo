Chat with UKG Demo

add Openai key to extension\scripts\content.js line 167

```
headers: {
      Authorization:
        "Bearer <add token here>",
      "Content-Type": "application/json",
    }
```


Log into - https://camsworldweb.mia.ucloud.int/default.aspx

    username - usa-canu
    
    password - password

navigate to edge://extensions/ || chrome://extensions/
click load unpacked

select the "extensions" folder from this repo

Navigate to the org chart
reload page once on the org chart

Ask the bot questions about the orgchart

![Alt text](screenshot.png)