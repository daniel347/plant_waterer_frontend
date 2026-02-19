
#ifdef COMPILE_FIREBASE
#define ENABLE_USER_AUTH
#define ENABLE_DATABASE
#include <FirebaseClient.h>

void setup() {}
void loop() {}

#else  // COMPILE_FIREBASE

#define FIREBASE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include "time.h"
#include <stdio.h>
#include <ctime>

#ifdef FIREBASE
#define ENABLE_USER_AUTH
#define ENABLE_DATABASE
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#endif //FIREBASE

#include "pump.hpp"
#include "servo_valve.hpp"
#include "plant.hpp"
#include "Database.hpp"
#include "MoistureSensor.hpp"

// ================== WiFi and Time Settings ==================
const char* ssid     = "PLUSNET-NZCF7H";
const char* password = "k6EVXfxg9yhLnV";
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;       // adjust for your timezone
const int   daylightOffset_sec = 0;  // adjust for daylight savings

#define Web_API_KEY "AIzaSyBMkmcudKEwkXGguzcNwZCY7md0rGaHf7I"
#define DATABASE_URL "https://plant-waterer-9be5e-default-rtdb.europe-west1.firebasedatabase.app/"
#define USER_EMAIL "daniel.siromani@gmail.com"
#define USER_PASS "greenLemons27"

// ================== Firebase ==================
#ifdef FIREBASE
Database database;
bool initialised = false; 
bool loaded_data = false;
bool set_listeners = false;
#endif //FIREBASE


// ================== Hardware Settings ==================
#define PUMP_PIN 25
#define PUMP_FLOW_RATE_ML_PER_MIN 80.0  // ml/min
#define VALVE_EN_PIN 4

#define MAX_N_PLANTS 4

// ================== Classes ==================

// ================== Hardware Objects ==================
Pump pump(PUMP_PIN, PUMP_FLOW_RATE_ML_PER_MIN);
ServoValve* valves[MAX_N_PLANTS];
MoistureSensor* sensors[MAX_N_PLANTS];

// ================== Plants ==================
// Plant plant1("Chilli", &valve1, 200.0, 24); // 50ml every 24 hours
// Plant plant2("Rosemary",  &valve2, 40.0, 24);
// Plant plant3("Mint",   &valve3, 60.0, 48);
// Plant plant4("Rose",   &valve4, 55.0, 24);

Plant* plants[MAX_N_PLANTS];
int n_plants = 0;
bool valves_engaged = false;

unsigned long last_checked = 0;
unsigned long last_pinged = 0;

#ifdef CYCLE_VALVE
ServoValve v(14, VALVE_EN_PIN);
#endif

#ifdef TEST_MOISTURE_SENSOR
MoistureSensor s(35);
#endif

#ifndef FIREBASE
//define plants from a JSON
char* json_str = "{\"Chilli\":{\"last_watered\":1755722861,\"valve_pin\":12,\"water_frequency\":24,\"water_volume\":250},\"Rosemary\":{\"last_watered\":1755722901,\"valve_pin\":14,\"water_frequency\":24,\"water_volume\":50}}";
#endif
// ==================== Database ============

JsonDocument plantDB;

// ================== Setup ==================
void setup() {
    Serial.begin(115200);
#ifdef FIREBASE
    connectWiFi();
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.println("Starting setup");
    // database.setup();
    Serial.println("setting up ssl client");
	//ssl_client.setConnectionTimeout(1000);
	//ssl_client.setHandshakeTimeout(5);

	Serial.println("setting up stream client");
	//stream_ssl_client.setInsecure();
	//stream_ssl_client.setConnectionTimeout(1000);
	//stream_ssl_client.setHandshakeTimeout(5);

	Serial.println("setting stream filters");
	//streamClient.setSSEFilters("get,put,patch,keep-alive,cancel,auth_revoked");

	// Initialize Firebase
	Serial.println("Initialising app");
    database.setup();
    Serial.println("Finished setup");

#endif
#ifdef CYCLE_VALVE
    v.begin();
#endif
#ifdef TEST_MOISTURE_SENSOR
    s.begin();
#endif

    for (int j = 0; j < n_plants; j++) {
        valves[j]->open();
    }

    Serial.println("System ready.");
    delay(1000);
}

// ================== Main Loop ==================
void loop() {
#ifdef CYCLE_VALVE
  cycleValve(&v);
#elifdef TEST_MOISTURE_SENSOR
  testMoistureSensor(&s);
#else

#ifdef FIREBASE
  // Serial.print("heap size: ");
  // Serial.println(ESP.getFreeHeap());
  if (database.loop()) {
#endif
    if (!initialised) {
      Serial.print("Starting initialisation");
      initialised = true;
#ifdef FIREBASE
      Serial.println("Authentication Information");
      Firebase.printf("User UID: %s\n", database.app.getUid().c_str());
      Firebase.printf("Auth Token: %s\n", database.app.getToken().c_str());
      Firebase.printf("Refresh Token: %s\n", database.app.getRefreshToken().c_str());

      database.initialisePlants(onInitialisePlants);
#else
      deserializeJson(plantDB, json_str);
      constructDB();
#endif
      // setDummyData();
    }
#ifdef FIREBASE
    if (loaded_data && !set_listeners) {
        database.setParamUpdates(n_plants, plants, onPlantUpdate);
        set_listeners = true;
    }
#endif
    if (millis() - last_checked > 60000) {
      last_checked = millis();
      if (!valves_engaged) {
          for (int i = 0; i < n_plants; i++) {
              if (plants[i]->needsWater()) {
                  for (int j = 0; j < n_plants; j++) {
                      valves[j]->close();
                  }
                  valves_engaged = true;
                  break;
              }
          }
      }

      for (int i = 0; i < n_plants; i++) {
          if (plants[i]->needsWater()) {
              Serial.printf("Watering %s...\n", plants[i]->getName());
              plants[i]->water(pump);
              Serial.printf("%s watered.\n", plants[i]->getName());
#ifdef FIREBASE
              database.updateLastWatered(plants[i]->getName(), plants[i]->lastWatered);
#endif
          }
      }

#ifdef FIREBASE
      if (last_checked - last_pinged > 3600000) {
        // ping every hour
        struct tm timeinfo;
        getLocalTime(&timeinfo);
        auto last_pinged = mktime(&timeinfo);
        database.updateOnline(last_pinged);
      }
#endif

      if (valves_engaged) {
          for (int j = 0; j < n_plants; j++) {
              valves[j]->open();
          }
          valves_engaged = false;
      }
    }
#ifdef FIREBASE
  }
  else {
    // Serial.println("Not ready");
    delay(25);
  }
#endif // FIREBASE

#endif // CYCLE_VALVE
}

// ================== Helper Functions ==================
void connectWiFi() {
    Serial.printf("Connecting to %s", ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println(" CONNECTED");
}

#ifdef FIREBASE
void constructDB(const char* data) {
  // print the data we get!
  deserializeJson(plantDB, data);
  serializeJson(plantDB, Serial);

  n_plants = 0;
  for (JsonPair kv : plantDB.as<JsonObject>()) {
    createNewPlant(kv.key().c_str(), kv.value());
  }
  loaded_data = true;
}

void createNewPlant(const char* plant_name, JsonObject plant_data) {
    if (n_plants >= MAX_N_PLANTS) {
      Serial.println("Maximum number of supported plants reached!");
      return;
    }
    Serial.println("Creating new plant");
    Serial.println(plant_name);
    Serial.println((unsigned long) plant_data["mode_params"]["interval"]["water_frequency"]);

    valves[n_plants] = new ServoValve(int(plant_data["valve_pin"]), VALVE_EN_PIN);
    valves[n_plants]->begin();
    valves[n_plants]->open();

    if (plant_data["sensor_pin"].is<int>() && plant_data["sensor_under_plate"].is<bool>()) {
        sensors[n_plants] = new MoistureSensor(plant_data["sensor_pin"], plant_data["sensor_under_plate"]);
    }
    else {
        sensors[n_plants] = NULL;
    }

    plants[n_plants] = new Plant(plant_name,
                                 valves[n_plants],
                                 sensors[n_plants],
                                 float(plant_data["mode_params"]["interval"]["water_volume"]),
                                 (unsigned int) plant_data["mode_params"]["interval"]["water_frequency"],
                                 time_t(plant_data["last_watered"]),
                                 plant_data["disabled"]);
    n_plants++;
}

void updatePlant(const char* new_data, const char* path) {
    Serial.println("Updating plant");
    Serial.println(path);
    Serial.println(strlen(path));
    if (strlen(path) == 1) {
        Serial.println("Root update");
    }
    else {
        char *tmp = strrchr(path, '/');
        if (tmp) {
            path = tmp+1;
        }
        Serial.println(path);
        if (strcmp(path, "last_watered") == 0) { // nothing to do
            Serial.println("last watered update");
            return;
        }
        else {
            for (int i = 0; i < n_plants; i++) {
                if (strcmp(plants[i]->getName(), path) == 0) {
                    JsonDocument new_data_json;
                    auto err = deserializeJson(new_data_json, new_data);
                    if (err == DeserializationError::Ok) {
                        serializeJson(new_data_json, Serial);

                        // update mode params
                        auto mode_params = new_data_json["mode_params"];
                        if (mode_params) {
                            auto interval = mode_params["interval"];
                            if (interval) {
                                Serial.println(interval["water_volume"].is<int>());
                                Serial.println(interval["water_frequency"].is<int>());
                                if (interval["water_volume"].is<int>() && interval["water_frequency"].is<int>()) {
                                    plants[i]->updateSettings(float(interval["water_volume"]), (unsigned int) interval["water_frequency"]);
                                }
                            }
                            
                        }

                        // update disabled
                        if (new_data_json["disabled"].is<bool>()) {
                            plants[i]->disabled = new_data_json["disabled"];
                        }

                    } else {
                        Serial.println("Could not deserialise data");
                    }
                    return;
                }
            }
            Serial.println("Creating new plant");
            // Not any of the current plants so we have to create a new one
            JsonDocument new_data_json;
            auto err = deserializeJson(new_data_json, new_data);
            if (err == DeserializationError::Ok) {
                serializeJson(new_data_json, Serial);
                createNewPlant(path, new_data_json.as<JsonObject>());
            } else {
                Serial.println("Could not deserialise data");
            }
        }
    }
}

void onInitialisePlants(AsyncResult& aResult) {
    processDataBase(aResult, constructDB);
}

void onPlantUpdate(AsyncResult& aResult) {
    processDataStream(aResult, updatePlant);
}

#endif //FIREBASE

void cycleValve(ServoValve *v) {
    v->open();
    Serial.println("open");
    delay(3000);
    v->close();
    Serial.println("closed");
    delay(3000);
}

void testMoistureSensor(MoistureSensor *s) {
    Serial.print("Moisture reading: ");
    Serial.println(s->read_water_saturation());
    delay(1000);
}

#endif //COMPILE_FIREBASE