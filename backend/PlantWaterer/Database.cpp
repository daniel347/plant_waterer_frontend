#ifndef COMPILE_FIREBASE

#define ENABLE_USER_AUTH
#define ENABLE_DATABASE
#include <FirebaseClient.h>
#include "Database.hpp"
#include <ArduinoJson.h>

Database::Database() {}

void Database::setup() {
	Serial.println("setting up ssl client");
	ssl_client.setInsecure();
	// ssl_client.setConnectionTimeout(1000);
	// ssl_client.setHandshakeTimeout(5);

	Serial.println("setting up stream client");
	stream_client.setInsecure();
	// stream_ssl_client.setConnectionTimeout(1000);
	// stream_ssl_client.setHandshakeTimeout(5);

	command_stream_client.setInsecure();

	// Initialize Firebase
	Serial.println("Initialising app");
	initializeApp(aClient, app, getAuth(user_auth), processDataSimple, "authTask");
	app.getApp<RealtimeDatabase>(database);
	database.url(DATABASE_URL);

	Serial.println("setting stream filters");
  streamClient.setSSEFilters("put,patch");
  commandStreamClient.setSSEFilters("put,patch");
}

void Database::initialisePlants(void (*onDataReceived)(AsyncResult& aResult)) {
	database.get(aClient, "/plants", onDataReceived, false, "RealtimeDatabase_GetTask");
}

void Database::updateLastWatered(const char* plantName, unsigned long lastWatered) {
	char lastWateredAdd[64];
	sprintf(lastWateredAdd, "/plants/%s/last_watered", plantName);
	database.set<number_t>(aClient, lastWateredAdd, number_t(lastWatered));
}

void Database::setPinUsed(int pinInd, int newPin) {
	char avail_pin[64];
	sprintf(avail_pin, "/system/available_pins/%i", pinInd);
	Serial.println("setting available_pins");
	Serial.println(avail_pin);
	Serial.println(newPin);
	database.set<number_t>(aClient, avail_pin, number_t(newPin));
}

void Database::setSensorPinUsed(int pinInd, int newPin) {
	char avail_sensor_pin[64];
	sprintf(avail_sensor_pin, "/system/available_sensor_pins/%i", pinInd);
	database.set<number_t>(aClient, avail_sensor_pin, number_t(newPin));
}

void Database::updateOnline(unsigned long lastPinged) {
	database.set<number_t>(aClient, "system/online", number_t(lastPinged));
}

void Database::setParamUpdates(int n_plants, Plant* plants[], void (*onPlantUpdate)(AsyncResult& aResult)) {
	database.get(streamClient, "/plants", onPlantUpdate, true, "streamTask");
}

void Database::setCommandListener(void (*onCommand)(AsyncResult& aResult)) {
	database.get(commandStreamClient, "/command", onCommand, true, "streamTask");
}

void Database::clearCommandFlags() {
	database.set<object_t>(aClient, "/command", object_t("{\"clean\":false, \"purge\":false, \"calibrate_plate_dry\":\"\"}"));
}

void Database::updateSensorData(const char* plantName, bool sensorUnderPlate, time_t t, float moisture, int dataPos) {
	char sensor_data_path[64];
	char obj[128];
	sprintf(obj, "{\"t\":%i, \"v\":%.2f}", t, moisture);

	if (sensorUnderPlate) {
		sprintf(sensor_data_path, "/sensor/%s/tray/%i", plantName, dataPos);
	}
	else {
		sprintf(sensor_data_path, "/sensor/%s/moisture/%i", plantName, dataPos);
	}

	database.set<object_t>(aClient, sensor_data_path, object_t(obj));
}

void Database::getDataPos(void (*onGetDataPos)(AsyncResult& aResult)) {
	database.get(aClient, "/sensor/data_pos", onGetDataPos, false, "RealtimeDatabase_GetTask");
}

void Database::updateDataPos(const char* plantName, int newDataPos) {
	char sensor_pos_path[64];
	sprintf(sensor_pos_path, "/sensor/data_pos/%s", plantName);
	database.set<number_t>(aClient, sensor_pos_path, number_t(newDataPos));
}

bool Database::loop() {
	// Serial.println("starting loop");
	app.loop();
	// Serial.println("finished app.loop");
	bool r = app.ready();
	// Serial.print(app.ready());
	// Serial.println("got app ready");
	return r;
}

void processDataSimple(AsyncResult& aResult) {
	// Exits when no result is available when calling from the loop.
	Serial.println("process data simple");
	if (aResult.isEvent())
		Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

	if (aResult.isDebug())
		Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());

	if (aResult.isError())
		Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

	if (aResult.available()) {
		Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
	}
}


void processDataBase(AsyncResult& aResult, void (*process_fn)(const char*)) {
	// Exits when no result is available when calling from the loop.
	if (!aResult.isResult())
		return;

	if (aResult.isEvent())
		Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

	if (aResult.isDebug())
		Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());

	if (aResult.isError())
		Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

	if (aResult.available()) {
		Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
		process_fn(aResult.c_str());
	}
}

void processDataStream(AsyncResult& aResult, void (*process_fn)(const char*, const char*)) {
	if (!aResult.isResult())
		return;

	if (aResult.isEvent())
		Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

	if (aResult.isDebug())
		Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());

	if (aResult.isError())
		Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

	if (aResult.available()) {
		Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
		RealtimeDatabaseResult &stream = aResult.to<RealtimeDatabaseResult>();
		if (stream.isStream())
			{
				Serial.println("----------------------------");
				Firebase.printf("task: %s\n", aResult.uid().c_str());
				Firebase.printf("event: %s\n", stream.event().c_str());
				Firebase.printf("path: %s\n", stream.dataPath().c_str());
				Firebase.printf("data: %s\n", stream.to<const char *>());
				Firebase.printf("type: %d\n", stream.type());

				const char * data = stream.to<const char *>();
				if (strcmp(data, "null") != 0) {
					process_fn(data, stream.dataPath().c_str());
				}
				else {
					Serial.println("No data");
				}
			}
		else
			{
				Serial.println("----------------------------");
				Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
			}
	}
}

void processData(AsyncResult& aResult) {
	auto empty = [](const char* data) {};
	processDataBase(aResult, empty);
}



#endif // COMPILE_FIREBASE