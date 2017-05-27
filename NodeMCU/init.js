load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');

// Helper C function get_led_gpio_pin() in src/main.c returns built-in LED GPIO
//let d4 = ffi('int get_led_gpio_pin()')(); // GPIO2 : D4
let d4 = 2; // GPIO2 : D4
let d1 = 5; // GPIO5 : D1
let d2 = 4; // GPIO4 : D2

// Blink built-in LED every second
GPIO.set_mode(d4, GPIO.MODE_OUTPUT);
GPIO.set_mode(d1, GPIO.MODE_OUTPUT);
GPIO.set_mode(d2, GPIO.MODE_OUTPUT);

let pub_topic = 'devices/status/' + Cfg.get('device.id');

MQTT.sub('control/n1', function(conn, topic, msg) {

    let myJSON = JSON.parse(msg);
    GPIO.write(myJSON.pin, myJSON.action);

    let ok = MQTT.pub(pub_topic, JSON.stringify({'status': GPIO.read(myJSON.pin),'pin': myJSON.pin,'node': 'n1'}), 1);
}, null);
