#include <stdio.h>
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>
#include "duktape.h" 

// Function to reload Lua script
void reload_script(lua_State **L, const char *filename) {
    lua_close(*L);  // Close the old state
    *L = luaL_newstate();  // Create a new Lua state
    luaL_openlibs(*L);  // Load libraries

    // Load and execute the script
    if (luaL_dofile(*L, filename) != LUA_OK) {
        fprintf(stderr, "Error reloading script: %s\n", lua_tostring(*L, -1));
        lua_pop(*L, 1);  // Remove error message from stack
    }
}

// Function to execute JavaScript code
void execute_js(const char *code) {
    duk_context *ctx = duk_create_heap_default();  // Create a Duktape heap
    if (!ctx) {
        fprintf(stderr, "Failed to create Duktape heap\n");
        return;
    }

    if (duk_peval_string(ctx, code) != 0) {  // Execute JS code
        fprintf(stderr, "Error executing JavaScript: %s\n", duk_safe_to_string(ctx, -1));
        duk_pop(ctx);  // Remove error
    }

    duk_destroy_heap(ctx);  // Clean up
}

// Main function
int main() {
    lua_State *L = luaL_newstate();  // Create a new Lua state
    luaL_openlibs(L);                 // Load Lua libraries

    const char *lua_script_name = "your_script.lua"; // Replace with your Lua script
    reload_script(&L, lua_script_name);  // Load the Lua script

    // Call the Lua function 'interrogate'
    lua_getglobal(L, "interrogate");  // Get the function from Lua
    if (lua_pcall(L, 0, 0, 0) != LUA_OK) {  // Call the function (0 arguments, 0 return values)
        fprintf(stderr, "Error calling Lua function: %s\n", lua_tostring(L, -1));
        lua_pop(L, 1);  // Remove error message from stack
    }

    // Now you can execute JavaScript code from C
    const char *js_code = "console.log('Hello from DynoEngine!');";
    execute_js(js_code);  // Call JavaScript function

    // Clean up
    lua_close(L);  // Close the Lua state
    return 0;
}
