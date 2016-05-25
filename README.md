# ThingsConnect-ESP8266
ThingsConnect is a firmware developed on top of the popular WiFi module ESP8266. ThingsConnect aims to simplify the development for Internet of Things (IoT) application by abstracting the connectivity layer and prompting to the high level interaction via ThingsConnect API from various platform. We handle all the firmware development/update and backend server to ensure you can use with ease.


#  Instruction

> proceed with Step 2 only after your ESP start blinking 

1. Compile and upload OTAinit.ino to your ESP8266-12 or ESP8266-12E.
2. Connect your laptop or smart phone with ESP AP using wifi. Standard ESP SSID is "TsC-EsP12-XXXXXXX" where X is number. Password is "123456789".
3. After connected, visit "http://thingsconnect.config" from your laptop or smart phone browser.
4. Connect your ESP with your house or office wifi network by clicking the "Connect WiFi" button from the web page.
5. Remains connected with ESP.

> the following steps required to be done in a browser with the Internet connection.

1. Create an account at https://everyweb.co/app if you haven't done it.
2. Create a qrcode by clicking the add button at the bottom right of dashboard. 
3. Click on the qr code your just created.
4. Subscribe to a service "EW ThingsConnect"
5. Add a device by clicking the '+' button at the Device section. You will need the information from ESP for this step. Follow below.
  1.  Visit the page "http://thingsconnect.config" again and click the second button "Device Detail" on the web page.
  2.  key in the "Device Id" for Id and "Serial Id" for Passcode.
  3.  Serial id should be listed down "Device" section if add successfully. This Serial id is required to be substituted in test.js at line 8.  
6. Add a user 
  1.  Add a user by clicking the "+" button at the User section. 
  2.  User detail should be listed if add successfully.
  3.  First line of user detail is userid which should be substituted at line 193 in test.js
  4.  Second line of user detail is passcode of user which should be substitued at line 194 in test.js
7. Substitute Appid and Appkey from the web page to test.js accordingly at line 191 & 192.
8. upload .js file and testpage.html to a server or using localhost.
9. visit the page you uploaded from a browser and start interacting with your "things" (led in this example). Configuration of "things" is as follow.

## Configuration of Things (eg. leds, temperature sensor and etc)

1. Turn a LED ON/OFF
  1. connect LED to your ESP to pin D1, D2 and D3 respectively.
  2. You should be able to turn the LED ON/OFF using testpage.html

2. RGB LED 
  1. connect RGB LED to your ESP to pin D6, D7 and D8 respectively.
  2. You should be able to change the color of LED through the color picker on testpage.html

3. Serial Testing
 1. this test require your esp to be connected with Arduino IDE's serial monitor
 2. you can send your serial data through the testpage.html textare input
 3. or received data from your ESP by entering text at the Arduino IDE's serial monitor

4. Analog input 
  1. connect your analog sensor (eg.LM35) to pin A0 of ESP
  2. select the time interval from the Analog dropdown of testpage.html
  3. Analog data with be sent as Integer.

## Status
> Currently, ThingsConnect is in Beta Testing. We looking forward your feedback to make ThingsConnect better suit for most IoT application development. Feel free to comment, ask question or report issuse of enhancement.

## TODO
- [x] Web API development
- [ ] REST API development
- [ ] Android API development
- [ ] IOS API development
