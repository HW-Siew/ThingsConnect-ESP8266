/*
  Instruction
  -----------
  
  1) Compile and upload this .ino to your ESP8266-12 or ESP8266-12E.

  * proceed with the following steps only when your ESP start blinking 
  2) Connect your laptop or smart phone with ESP AP using wifi. Standard ESP SSID is "TsC-EsP12-XXXXXXX" where X is number. Password is "123456789".
  4) After connected, visit "http://thingsconnect.config" from your laptop or smart phone browser.
  5) Connect your ESP with your house or office wifi network by clicking the "Connect WiFi" button from the web page.
  6) Remains connected with ESP.

  * the following steps required to be done in a browser with the Internet connection.
  1) Create an account at https://everyweb.co/app if you haven't done it.
  2) Create a qrcode by clicking the add button at the bottom right of dashboard. 
  3) Click on the qr code your just created.
  4) Subscribe to a service "EW ThingsConnect"
  5) Add a device by clicking the '+' button at the Device section. You will need the information from ESP for this step. Follow below.
    5.1)  Visit the page "http://thingsconnect.config" again and click the second button "Device Detail" on the web page.
    5.2)  key in the "Device Id" for Id and "Serial Id" for Passcode.
    5.3)  Serial id should be listed down "Device" section if add successfully. This Serial id is required to be substituted in test.js at line 8.  
  6) Add a user 
    6.1)  Add a user by clicking the "+" button at the User section. 
    6.2)  User detail should be listed if add successfully.
    6.3)  First line of user detail is userid which should be substituted at line 193 in test.js
    6.4)  Second line of user detail is passcode of user which should be substitued at line 194 in test.js
  7) Substitute Appid and Appkey from the web page to test.js accordingly at line 191 & 192.
  8) upload .js file and testpage.html to a server or using localhost.
  9) visit the page you uploaded from a browser and start interacting with your "things" (led in this example). Configuration of "things" is as follow.

  Configuration of Things (eg. leds, temperature sensor and etc)
  1) Turn a LED ON/OFF
    1.1) connect LED to your ESP to pin D1, D2 and D3 respectively.
    1.2) You should be able to turn the LED ON/OFF using testpage.html

  2) RGB LED 
    2.1) connect RGB LED to your ESP to pin D6, D7 and D8 respectively.
    2.2) You should be able to change the color of LED through the color picker on testpage.html

  3) Serial Testing
  * this test require your esp to be connected with Arduino IDE's serial monitor
    3.1) you can send your serial data through the testpage.html textare input
    3.2) or received data from your ESP by entering text at the Arduino IDE's serial monitor

  4) Analog input 
    4.1) connect your analog sensor (eg.LM35) to pin A0 of ESP
    4.2) select the time interval from the Analog dropdown of testpage.html
    4.3) Analog data with be sent as Integer.

*/

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#include <EEPROM.h>

#define USE_SERIAL      Serial
#define HMAC_SIZE       20      
#define SIZE            768     
#define INIT_ADDRESS    0 
#define EEPROM_SIZE     4096

ESP8266WiFiMulti WiFiMulti;

void wipeAll(){

    EEPROM.begin(EEPROM_SIZE);
    
    int addr = INIT_ADDRESS;
    while(addr < EEPROM_SIZE) {
        EEPROM.write(addr++,0);
    }
    
    EEPROM.end();
}

byte getVal(char c){
  
   if(c >= '0' && c <= '9')
     return (byte)(c - '0');
   else
     return (byte)(c-'a'+10);
}

void init(String payload){
  
  EEPROM.begin(SIZE);

  int len = payload.length();
  int address = INIT_ADDRESS;
  
  for(int i = 0 ; i <= len; i+=2){
    byte v = getVal(payload[i]) << 4;
    v |= getVal(payload[i+1]);
    EEPROM.write(address++, v); 
  }
  
  EEPROM.end();
}

void setup() {

    USE_SERIAL.begin(115200);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    WiFiMulti.addAP("MaGIC Committee", "m@gicPhase2");

    pinMode(D0,OUTPUT);
    digitalWrite(D0,HIGH);

    wipeAll();
}

void loop() {
    // wait for WiFi connection
    if((WiFiMulti.run() == WL_CONNECTED)) {

        digitalWrite(D0,LOW);
        USE_SERIAL.println("[INFO] Initialization begins...");

        HTTPClient http;
        http.begin("http://cloud.everyweb.co/initDevice");

        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();

                if(payload.length() != 1536) return;
   
                init(payload);
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        delay(1000);
        digitalWrite(D0,HIGH);
        delay(1000);
        digitalWrite(D0,LOW);

        USE_SERIAL.println("[INFO] Loading firmware...");
        t_httpUpdate_return ret = ESPhttpUpdate.update("http://cloud.everyweb.co/otaUpdate",String(0));

        switch(ret) {
            case HTTP_UPDATE_FAILED:
                USE_SERIAL.printf("HTTP_UPDATE_FAILD Error (%d): %s", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
                break;

            case HTTP_UPDATE_NO_UPDATES:
                USE_SERIAL.println("HTTP_UPDATE_NO_UPDATES");
                break;

            case HTTP_UPDATE_OK:
                USE_SERIAL.println("HTTP_UPDATE_OK");
                break;
        }

      delay(1000000);
    }
}

