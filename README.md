# `pageManager` - A Modular Programmed JavaScript Suite

`pageManager` is a versatile, module-based JavaScript suite that consists of `httpModule`, `formModule`, `storageModule`, `partialViewModule`, `browserModule`, `breakpointModule`, and `signalRModule`. Each of these modules serves a specific functionality and can be used independently.

## Structure 

```markdown
└── pageManager
    ├── httpModule
    ├── formModule
    ├── storageModule
    ├── partialViewModule
    ├── browserModule
    ├── breakpointModule
    └── signalRModule
```

## Modules

### `httpModule`

This module handles HTTP requests. It includes methods for GET, POST, PUT, DELETE, PATCH HTTP methods using Fetch API. 

### `formModule`

`formModule` takes care of form data processing and handling form submission events. It has capabilities to process multi-select, checkbox and file input controls.

### `storageModule`

This module provides an interface to manipulate `localStorage` and `sessionStorage`. It has built-in capability to check if the web storage is supported on the current browser.

### `partialViewModule`

`partialViewModule` is responsible for fetching partial views from a given path and injecting them into a target container. It also provides caching functionality to optimize repeat fetch operations.

### `browserModule`

`browserModule` can be used to determine browser-related information such as name, version, operating system, os version, touch supporting capability, and whether it's a mobile browser or not.

### `breakpointModule`

A module that can be used to define multiple breakpoints for managing responsive design. It allows defining custom breakpoints and hooks corresponding event listeners.

### `signalRModule`

`signalRModule` utilizes SignalR library for real-time web functionality. It provides an interface to start and stop the connection, send a message to the SignalR hub, and listen for specific events from the Hub.

## Usage

You can simply import the pageManager module in your script and access features as per your need like pageManager.http.get(path, headers, formId) for a Get HTTP request or pageManager.storage.set(key, value, storageType, lifetime), etc.

```HTML
<script src="path/to/pageManager.js"></script>
<script>
    pageManager.http.get('/api/data');
</script>
```

Please refer to the provided comments inside each module for better understanding of individual functions.
This documentation is designed to help you understand the basic functionalities of the pageManager suite. For deeper understanding or for help using more advanced features, please refer to the inline comments in the pageManager JavaScript files.
