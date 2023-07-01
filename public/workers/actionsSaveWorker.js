!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).idb={})}(this,(function(e){"use strict";let t,n;const r=new WeakMap,o=new WeakMap,s=new WeakMap,i=new WeakMap,a=new WeakMap;let c={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return o.get(e);if("objectStoreNames"===t)return e.objectStoreNames||s.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return f(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function d(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(n||(n=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(l(this),t),f(r.get(this))}:function(...t){return f(e.apply(l(this),t))}:function(t,...n){const r=e.call(l(this),t,...n);return s.set(r,t.sort?t.sort():[t]),f(r)}}function u(e){return"function"==typeof e?d(e):(e instanceof IDBTransaction&&function(e){if(o.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)}));o.set(e,t)}(e),n=e,(t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>n instanceof e))?new Proxy(e,c):e);var n}function f(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(f(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)}));return t.then((t=>{t instanceof IDBCursor&&r.set(t,e)})).catch((()=>{})),a.set(t,e),t}(e);if(i.has(e))return i.get(e);const t=u(e);return t!==e&&(i.set(e,t),a.set(t,e)),t}const l=e=>a.get(e);const p=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],b=new Map;function v(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(b.get(t))return b.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=D.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!p.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let i=s.store;return r&&(i=i.index(t.shift())),(await Promise.all([i[n](...t),o&&s.done]))[0]};return b.set(t,s),s}c=(e=>({...e,get:(t,n,r)=>v(t,n)||e.get(t,n,r),has:(t,n)=>!!v(t,n)||e.has(t,n)}))(c),e.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(e=>t(e.oldVersion,e))),f(n).then((()=>{}))},e.openDB=function(e,t,{blocked:n,upgrade:r,blocking:o,terminated:s}={}){const i=indexedDB.open(e,t),a=f(i);return r&&i.addEventListener("upgradeneeded",(e=>{r(f(i.result),e.oldVersion,e.newVersion,f(i.transaction),e)})),n&&i.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),a.then((e=>{s&&e.addEventListener("close",(()=>s())),o&&e.addEventListener("versionchange",(e=>o(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),a},e.unwrap=l,e.wrap=f}));

onmessage = async function(event) {
    const workerData = event.data

    if(workerData.type == 'addSaving'){
        await doDatabaseStuff(workerData.type, workerData.ctx)
    } else if(workerData.type == 'getSaving'){
        //const saving = await doDatabaseStuff(workerData.type, workerData.ctx)
        //postMessage(saving)
    } else if(workerData.type == 'deleteSaving'){
        await doDatabaseStuff(workerData.type, workerData.ctx)
    } else if(workerData.type == 'putSaving'){
        await doDatabaseStuff(workerData.type, workerData.ctx)
    } else if(workerData.type == 'checkingSavings'){
      const savings = await doDatabaseStuff(workerData.type)
      postMessage({ type: 'savingsCheckingcomplate', savings })
    }
    // else if(workerData.type=='check-saving-exist'){
    //     console.log('check-saving-exist');
    //     const saving = await doDatabaseStuff(workerData.type, workerData.ctx)
    //     console.log(saving);
    //     postMessage({ type: workerData.type, saving })
    // }

    //postMessage(); - событие для главного процесса
}

async function doDatabaseStuff(type, ctx) {
      const db = await idb.openDB("STExamClient", 2);

      const savesTransaction = db.transaction('saves', 'readwrite')
      const saves = savesTransaction.objectStore('saves')

      try{
        if(type=='addSaving'){
          await saves.add(ctx.data)
          .then(()=>{
            console.log('[Local-DB] New saving was added');
          })
          .catch(error=>{
            throw error
          })
        }else if(type=='getSaving'){
          try {
            const result = await saves.get(ctx.id)
            console.log(`[Local-DB] Saving #${ctx.id} was geted`);
            return result
          } catch (error) {
            throw error
          }
        }else if(type=='deleteSaving'){
          await saves.delete(ctx.id)
          .then(()=>{
            console.log('[Local-DB] Saving was deleted');
          })
          .catch(error=>{
            throw error
          })
        }else if(type=='putSaving'){
          await saves.put(ctx.data)
          .then(()=>{
            console.log('[Local-DB] Process saved');
          })
          .catch(error=>{
            throw error
          })
        }
        else if(type=='checkingSavings'){
          const savings = await saves.getAll()

          savings.forEach(async (saving) => {
            await saves.delete(saving.id)
          });
          
          return savings
        }
        // else if(type=='check-saving-exist'){
        //   try {
        //     const savings = await saves.getAll()
        //     const existSaving = savings.find(saving=>saving.userID == ctx.userID && saving.examID == ctx.examID)

        //     if(existSaving){
        //       return existSaving
        //     } else {
        //       return null
        //     }
        //   } catch (error) {
        //     throw error
        //   }
        // }
      }catch(e){
        console.error('(Local DB) Error: ', e.message)
      }
  }