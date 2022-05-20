const { exec } = require('child_process');

async function hitFilemakerLinks() {
  console.log('starting novelty FMP Link');
  exec(
    'start fmp://fm.server:IdesOfMarch@192.168.1.180/LOROCO.fmp12?script=(FMP)%20Fotomerchant%20Novelties',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`novelty FMP link fired`);
      if (stderr != '') console.error(`stderr: ${stderr}`);
    },
  );

  setTimeout(() => {
    console.log('starting Loroco FMP Link');
    exec(
      'start fmp://FM.Server:IdesOfMarch@192.168.1.180/LOROCO.fmp12?script=(FMP)%20Fotomerchant%20Lorocos',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);

          return;
        }
        console.log(`Loroco FMP link fired`);
        if (stderr != '') console.error(`stderr: ${stderr}`);
      },
    );
  }, 15000);
}

module.exports = { hitFilemakerLinks };
