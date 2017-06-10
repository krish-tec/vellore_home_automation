load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');

let d1 = 5; // GPIO5 : D1
let d2 = 4; // GPIO4 : D2
let d4 = 2; // GPIO2 : D4

GPIO.set_mode(d1, GPIO.MODE_OUTPUT);
GPIO.set_mode(d2, GPIO.MODE_OUTPUT);
GPIO.set_mode(d4, GPIO.MODE_OUTPUT);

GPIO.set_pull(d1, GPIO.PULL_DOWN);
GPIO.set_pull(d2, GPIO.PULL_DOWN);
GPIO.set_pull(d4, GPIO.PULL_DOWN);

GPIO.write(5, 1);
GPIO.write(4, 1);
GPIO.write(2, 1);


let node = 'n1';
let pub_topic = 'devices/status/' + Cfg.get('device.id');
let sub_topic = 'control/' + node;

MQTT.sub(sub_topic, function(conn, topic, msg) {
    //print (msg);

    let myJSON = JSON.parse(msg);
    GPIO.write(myJSON.pin, myJSON.action);

    let ok = MQTT.pub(pub_topic, JSON.stringify({'status': GPIO.read(myJSON.pin),'pin': myJSON.pin,'node': node, 'actionBy': myJSON.actionBy}), 1);
    //print(ok, " published");
}, null);
