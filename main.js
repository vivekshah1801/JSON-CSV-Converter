$(document).ready(function(){

    $(".convertbtn").click(function(event){
        if(event.currentTarget.value == "JSONbtn"){
            // converting from CSV to JSON
            let csvdata = $("#csvtext").val();
            if(!csvdata)
            {
                alert("provide some csv data to convert");
                return 0;
            }
            csvdata = csvdata.split("\n");
            datarows = csvdata.slice(1);

            headerrow = csvdata[0].split(",");
            totalheaders = headerrow.length;

            for(i=0;i<totalheaders;i++)
            {
                data = headerrow[i];
                if(data.includes('"')){
                    data = data.replace(/"/g,'""');
                }
                headerrow[i] = data.trim();
            }

            if(datarows.length==0)
            {
                alert("provide some csv data other than headers to convert");
                return 0;
            }

            finaljson = "[\n";

            for(i=0;i<datarows.length;i++)
            {
                datarow = datarows[i].split(",");
                if(datarow.length != totalheaders)
                {
                    alert("Mis-formatted CSV on line :" + (i+2));
                    return 0;
                }

                onerowjson = "\t{\n"; 

                for(j=0;j<datarow.length;j++)
                {
                    if(j!=0)
                    {
                        onerowjson += ",\n"
                    }
                    data = datarow[j];
                    if(data.includes('"')){
                        data = data.replace(/"/g,'""');
                    }
                    
                    if(isNaN(data))
                    {
                        data = '"' + data + '"';
                    }

                    onerowjson += "\t\t\"" + headerrow[j] +  "\" : " + data;
                }
                onerowjson += "\n\t}";
                
                if(i!=0)
                    finaljson += ",\n";
                finaljson += onerowjson;
                
            }

            finaljson += "\n]";
            $("#jsontext").val(finaljson);
            
        }
        else{
            // converting from JSON to CSV
            let jsondata = $("#jsontext").val();
            if(!jsondata)
            {
                alert("provide some json data to convert");
                return 0;
            }
            if(jsondata.includes('""')){
                jsondata = jsondata.replace(/""/g,'');                
            }
            jsondata = jsondata.replace(/:\s*,/g,': "",');
            jsondata = jsondata.replace(/:\s*}/g,': ""}');
            
            jsonobj = JSON.parse(jsondata);
            csv = "";
            if(jsonobj.length<=0)
            {
                finalcsv = "";
                $("#csvtext").val(finalcsv);
                return 0;
            }
            headers = Object.keys(jsonobj[0]);
            csv += headers.join(",") + "\n";
            for(i=0;i<jsonobj.length;i++)
            {
                data = jsonobj[i];
                onelinecsv = "";
                for(j=0;j<headers.length;j++)
                {
                    if(onelinecsv != "") onelinecsv += ",";
                    onelinecsv += data[headers[j]];
                }
                if(csv!=headers.join(",") + "\n")csv += "\n";
                csv += onelinecsv;
            }
            finalcsv = csv;
            $("#csvtext").val(finalcsv);
        }
    });



    $("#csvclear").click(function(){
        log("hi");  
        $("#csvtext").val("");
    });

    $("#jsonclear").click(function(){
        $("#jsontext").val("");
    });

    $("#csvcopy").click(function(){
        content = $("#csvtext").select();
        document.execCommand("copy");
        active = document.activeElement;
        active.selectionStart = active.selectionEnd;
        alert("copied");
    });

    $("#jsoncopy").click(function(){
        content = $("#jsontext").select();
        document.execCommand("copy");
        active = document.activeElement;
        active.selectionStart = active.selectionEnd;
        alert("copied");
    });
    

    $("#csvsave").click(function(){
        content = $("#csvtext").val();
        blob = new Blob([content], {type: "text/plain;charset=utf-8"});  
        saveAs(blob,"converted.csv");
    });

    $("#jsonsave").click(function(){
        content = $("#jsontext").val();
        blob = new Blob([content], {type: "application/json;charset=utf-8"});  
        saveAs(blob,"converted.json");
    });
});

function log(s){
    console.log(s);
}