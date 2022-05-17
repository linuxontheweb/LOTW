export const mod = function() {

let db;
const name = "objects";
const VERSION = 1;
this.init=(dbname)=>{
	const req = (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB).open(dbname, VERSION);
	db = new Promise((resolve, reject) => {
		req.onsuccess = (e) => {
			resolve(e.target.result);
		};
		req.onerror = (e) => {
			reject(e);
		};
		req.onupgradeneeded = (e) => {
			const db = e.target.result;
			if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
		};
		req.onblocked = (e) => {
			reject(e);
		};
	});
};
this.tx = () => {
	const set = (key, value) => db.then((database) => new Promise((resolve, reject) => {
		let transaction = database.transaction([name], "readwrite");
		transaction.onabort = function(e) {
			let error = e.target.error;
			throw error;
		};
		const store = transaction.objectStore(name);
		let val = value;
		let request = store.put(val, key);
		request.onsuccess = () => {
			resolve(true);
		};
		request.onerror = (e) => {
console.error(e);
			resolve(false);
		};
	}));
	const get = (key) => db.then((database) => new Promise((resolve, reject) => {
		let transaction = database.transaction([name], "readonly");
		transaction.onabort = function(e) {
			let error = e.target.error;
			throw error;
		};
		const store = transaction.objectStore(name);
		let request = store.get(key);
		request.onsuccess = function(e) {
			resolve(e.target.result);
		};
		request.onerror = e => {
console.error(e);
			resolve(false);
		};
	}));
	const keys = () => db.then((database) => new Promise((resolve, reject) => {
		let transaction = database.transaction([name], "readonly");
		transaction.onabort = function(e) {
			let error = e.target.error;
			throw error;
		};
		const store = transaction.objectStore(name);
		let request = store.getAllKeys();
		request.onsuccess = function(e) {
			resolve(e.target.result);
		};
		request.onerror = reject;
	}));
	const indexedDbDelete = (key) => db.then((database) => new Promise((resolve, reject) => {
		let transaction = database.transaction([name], "readwrite");
		transaction.onabort = function(e) {
			let error = e.target.error;
			throw error;
		};
		const store = transaction.objectStore(name);
		let request = store.delete(key);
		request.onsuccess = resolve;
		request.onerror = reject;
	}));
	const purgeDatabase = () => db.then((database) => new Promise((resolve, reject) => {
		let transaction = database.transaction([name], "readwrite");
		transaction.onabort = function(e) {
			let error = e.target.error;
			throw error;
		};
		const store = transaction.objectStore(name);
		let request = store.clear();
		request.onsuccess = resolve;
		request.onerror = reject;
	}));
	const deleteDatabase = () => {
		window.indexedDB.deleteDatabase(window.location.origin);
	};
	return {
		get,
		set,
		delete: indexedDbDelete,
		purgeDatabase,
		deleteDatabase,
		keys
	};
};

}

