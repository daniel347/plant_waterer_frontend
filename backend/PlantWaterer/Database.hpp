#ifndef COMPILE_FIREBASE

#ifndef DATABASE_
#define DATABASE_

#define Web_API_KEY "AIzaSyBMkmcudKEwkXGguzcNwZCY7md0rGaHf7I"
#define DATABASE_URL "https://plant-waterer-9be5e-default-rtdb.europe-west1.firebasedatabase.app/"
#define USER_EMAIL "daniel.siromani@gmail.com"
#define USER_PASS "greenLemons27"

#define ENABLE_USER_AUTH
#define ENABLE_DATABASE
#include <FirebaseClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "Plant.hpp"

using AsyncClient = AsyncClientClass;

class Database {
	public:
		Database();
		void setup();
		void initialisePlants(void(*onDataReceived)(AsyncResult& aResult));
		void setParamUpdates(int n_plants, Plant* plants[], void (*onPlantUpdate)(AsyncResult& aResult));
		void setPinUsed(int pinInd, int newPin);
		void setSensorPinUsed(int pinInd, int newPin);
		void updateLastWatered(const char* plantName, unsigned long lastWatered);
		void updateOnline(unsigned long lastPinged);
		bool loop();
		FirebaseApp app;


	private:
		WiFiClientSecure ssl_client, stream_client;

		AsyncClient aClient = AsyncClient(ssl_client);
		AsyncClient streamClient = AsyncClient(stream_client);

		UserAuth user_auth = UserAuth(Web_API_KEY, USER_EMAIL, USER_PASS, 3000 /* expire period in seconds (<3600) */);

		RealtimeDatabase database;
		AsyncResult databaseResult;

		bool initialised = false;
};
void processDataBase(AsyncResult& aResult, void (*process_fn)(const char*));
void processDataStream(AsyncResult& aResult, void (*process_fn)(const char*, const char*));
void processDataSimple(AsyncResult& aResult);
void processData(AsyncResult& aResult);
#endif // DATABASE_
#endif // COMPILE_FIREBASE
