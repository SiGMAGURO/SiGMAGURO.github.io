#include <M5StickC.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <MQTTPubSubClient.h>
#include <ArduinoJson.h>

const char* SSID = "Centon";
const char* PASS = "0929214301";
const char* HOST = "broker.mqttgo.io";
uint16_t PORT = 8084;
const char* PATH = "/mqtt";
const char* TOPIC = "SiGMAGURO/JumpScares/join";

WebSocketsClient ws;
MQTTPubSubClient mqtt;
String uid;
float lastPitch = 0.0;
const float THRESHOLD = 1.0;

String generateUID() {
  String s;
  for (int i = 0; i < 4; i++) s += char(random(65, 91));
  for (int i = 0; i < 3; i++) s += char(random(48, 58));
  return s;
}

void sendEvent(const char* type, float value) {
  StaticJsonDocument<200> doc;
  doc["uid"] = uid;
  doc["type"] = type;
  doc["value"] = value;
  String payload;
  serializeJson(doc, payload);
  mqtt.publish(TOPIC, payload);
}

void setup() {
  M5.begin();
  M5.Lcd.setRotation(3);
  randomSeed(esp_random());
  uid = generateUID();
  WiFi.begin(SSID, PASS);
  ws.beginSSL(HOST, PORT, PATH);
  ws.setReconnectInterval(2000);
  mqtt.begin(ws);
  M5.IMU.Init();
  M5.Lcd.setTextSize(3);
  M5.Lcd.printf("%s\n", uid.c_str());
  M5.Lcd.setTextSize(2);
}

void loop() {
  ws.loop();
  bool wifiConnected = WiFi.status() == WL_CONNECTED;
  static bool lastWifiConnected = false;
  if (wifiConnected && !mqtt.isConnected()) {
    mqtt.connect(uid);
    M5.Lcd.setCursor(0, 30);
    M5.Lcd.printf("WiFi:OK\nMQTT:%s\n", mqtt.isConnected() ? "OK" : "ERR");
  }
  if (wifiConnected != lastWifiConnected) {
    M5.Lcd.setCursor(0, 30);
    M5.Lcd.printf("WiFi:%s\nMQTT:%s\n", wifiConnected ? "OK" : "ERR", mqtt.isConnected() ? "OK" : "ERR");
    lastWifiConnected = wifiConnected;
  }

  mqtt.update();
  M5.update();

  if (mqtt.isConnected()) {
    if (M5.BtnA.wasPressed()) sendEvent("btn", 0);

    float pitch, roll, yaw;
    M5.IMU.getAhrsData(&pitch, &roll, &yaw);
    if (fabs(pitch - lastPitch) > THRESHOLD) {
      sendEvent("pitch", pitch);
      lastPitch = pitch;
    }
  }

  delay(100);
}
