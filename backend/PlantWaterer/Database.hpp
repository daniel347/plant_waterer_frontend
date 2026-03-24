#ifndef COMPILE_FIREBASE

#ifndef DATABASE_
#define DATABASE_

#define ENABLE_USER_AUTH
#define ENABLE_DATABASE
#include <FirebaseClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "Plant.hpp"
#include "secrets.hpp"

using AsyncClient = AsyncClientClass;

struct {
    time_t t;
    char key[32];
} DatumTimestamp;

class Database {
	public:
		Database();
		void setup();
		void initialisePlants(void(*onDataReceived)(AsyncResult& aResult));
		void setParamUpdates(int n_plants, Plant* plants[], void (*onPlantUpdate)(AsyncResult& aResult));
		void setCommandListener(void (*onCommand)(AsyncResult& aResult));
		void clearCommandFlags();
		void setPinUsed(int pinInd, int newPin);
		void setSensorPinUsed(int pinInd, int newPin);
		void updateLastWatered(const char* plantName, unsigned long lastWatered);
		void updateSensorData(const char* plantName, bool sensorUnderPlate, time_t t, float moisture); 
		void updateOnline(unsigned long lastPinged);
		void getDataPos(void (*onGetDataPos)(AsyncResult& aResult));
		void updateDataPos(const char* plantName, int newDataPos);
		void updateSensorData(const char* plantName, bool sensorUnderPlate, time_t t, float moisture, int dataPos);
		bool loop();
		FirebaseApp app;


	private:
		WiFiClientSecure ssl_client, stream_client, command_stream_client;

		AsyncClient aClient = AsyncClient(ssl_client);
		AsyncClient streamClient = AsyncClient(stream_client);
		AsyncClient commandStreamClient = AsyncClient(command_stream_client);

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
