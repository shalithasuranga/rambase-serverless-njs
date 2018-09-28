
template = '';
templateYml = `
provider:
  name: faas
  gateway: http://172.20.5.81:31112

functions:
  {func_name}:
    lang: Dockerfile
    handler: .
    image: sharancher/{func_name}:latest

`;

faasName = 'get-sales';
const baseSource = 'generic-rambase-serverless';

let App = {
    init : function() {
        App.loadFunctionSource();
    },

    loadFunctionSource : function() {
        Neutralino.filesystem.readFile(baseSource + '/serverless/ServerlessFunction.cs', (r) => {
            document.getElementById('source').value = r.content;
        },
        () =>{

        }
        );
    },

    saveFunctionSource : function() {
        Neutralino.filesystem.writeFile(baseSource + '/serverless/ServerlessFunction.cs', document.getElementById('source').value, () => {
            alert('File saved!');
        },
        () =>{

        }
        );
    },

    writeYml : function() {
        return new Promise((resolve, reject) => {
            faasName = document.getElementById('faasName').value;
            template = templateYml.replace(/{func_name}/g , faasName);
            Neutralino.filesystem.writeFile(baseSource + '/' + faasName + '.yml', template, function() {
                resolve('done');
            }, function() {
                reject('error');
            });

        });

    },

    runCommand : function(cmdId) {
        let proms = [];
        let commands = [
            ('cd ' + baseSource + '; sudo faas-cli build -f ' + faasName + '.yml'),
            ('cd ' + baseSource + '; sudo faas-cli push -f ' + faasName + '.yml'),
            ('cd ' + baseSource + '; sudo faas-cli deploy -f ' + faasName + '.yml'),
        ];
        return new Promise((resolve, reject) => {
                setTimeout(() => {
                    Neutralino.os.runCommand(commands[cmdId], function() {
                        resolve('done');
                    } ,function() {
                        reject('error');
                    });
                },1000);
        });
    },

    deploy : function() {
        App.writeYml().then((r) => {
            App.runCommand(0).then(() => {
                App.runCommand(1).then(() => {
                    App.runCommand(2).then(() => {
                        alert('Function deployed!');
                    }).catch(() => {
        
                    });
                }).catch(() => {

                });
            }).catch(() => {
            });
        }).catch();
    }
};
    

Neutralino.init({
    load: () => {
        App.init();
    },
    pingSuccessCallback : () => {

    },
    pingFailCallback : () => {

    }
});