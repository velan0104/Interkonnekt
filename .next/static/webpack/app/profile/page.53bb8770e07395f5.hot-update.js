"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/profile/page",{

/***/ "(app-pages-browser)/./src/Slice/postsSlice.ts":
/*!*********************************!*\
  !*** ./src/Slice/postsSlice.ts ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addCommentAsync: () => (/* binding */ addCommentAsync),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   fetchPosts: () => (/* binding */ fetchPosts),\n/* harmony export */   toggleLikeAsync: () => (/* binding */ toggleLikeAsync)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ \"(app-pages-browser)/./node_modules/axios/lib/axios.js\");\n\n\nconst fetchPosts = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/fetchPosts', async (param)=>{\n    let { userId } = param;\n    const response = await axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].post('/api/getPosts');\n    console.log(\"Slice called:\", response.data.posts);\n    return response.data.posts;\n});\n// export const fetchPosts = createAsyncThunk(\n//   'posts/fetchPosts',\n//   async (filter?: { userId?: string; postId?: string }) => {\n//     let url = '/api/getPosts';\n//     // Add filter parameters to the URL\n//     if (filter) {\n//       const { userId, postId } = filter;\n//       if (userId) {\n//         url += `?userId=${userId}`; // Fetch posts by a specific user\n//       }\n//       if (postId) {\n//         url += `${userId ? '&' : '?'}postId=${postId}`; // Fetch specific post by ID\n//       }\n//     }\n//     const response = await axios.get(url);\n//     console.log('Slice called:', response.data.posts);\n//     return response.data.posts;\n//   }\n// );\nconst toggleLikeAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/toggleLike', async (param)=>{\n    let { postId, userId } = param;\n    const response = await fetch(\"/api/likes\", {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        likes: data.likes.map((like)=>({\n                userId: like.userId\n            }))\n    };\n});\nconst addCommentAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/addCommentAsync', async (param)=>{\n    let { postId, userId, content } = param;\n    const response = await fetch('/api/comments', {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId,\n            content\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        comments: data.comments.map((comment)=>({\n                userId: comment.userId\n            }))\n    };\n});\nconst initialState = {\n    posts: [],\n    status: 'idle',\n    error: null\n};\nconst postsSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: 'posts',\n    initialState,\n    reducers: {},\n    extraReducers: (builder)=>{\n        builder.addCase(fetchPosts.pending, (state)=>{\n            state.status = 'loading';\n        }).addCase(fetchPosts.fulfilled, (state, action)=>{\n            state.status = 'succeeded';\n            state.posts = action.payload;\n        }).addCase(fetchPosts.rejected, (state, action)=>{\n            state.status = 'failed';\n        // state.error = action.error.message;\n        }).addCase(toggleLikeAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload;\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    ...updatedPost,\n                    likes: updatedPost.likes.map((like)=>({\n                            userId: like.userId\n                        }))\n                };\n            }\n        }).addCase(addCommentAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload; // Ensure payload includes `comments`\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    comments: updatedPost.comments.map((comment)=>({\n                            ...comment,\n                            post_id: comment.post_id,\n                            userId: comment.userId,\n                            content: comment.content,\n                            createdAt: comment.createdAt\n                        }))\n                };\n            }\n        });\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (postsSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9TbGljZS9wb3N0c1NsaWNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFnRjtBQUN0RDtBQUluQixNQUFNRyxhQUFhRixrRUFBZ0JBLENBQUMsb0JBQW9CO1FBQU8sRUFBQ0csTUFBTSxFQUFpQjtJQUM1RixNQUFNQyxXQUFXLE1BQU1ILDZDQUFLQSxDQUFDSSxJQUFJLENBQUM7SUFDbENDLFFBQVFDLEdBQUcsQ0FBQyxpQkFBZ0JILFNBQVNJLElBQUksQ0FBQ0MsS0FBSztJQUMvQyxPQUFPTCxTQUFTSSxJQUFJLENBQUNDLEtBQUs7QUFDNUIsR0FBRztBQUVILDhDQUE4QztBQUM5Qyx3QkFBd0I7QUFDeEIsK0RBQStEO0FBQy9ELGlDQUFpQztBQUVqQywwQ0FBMEM7QUFDMUMsb0JBQW9CO0FBQ3BCLDJDQUEyQztBQUMzQyxzQkFBc0I7QUFDdEIsd0VBQXdFO0FBQ3hFLFVBQVU7QUFDVixzQkFBc0I7QUFDdEIsdUZBQXVGO0FBQ3ZGLFVBQVU7QUFDVixRQUFRO0FBRVIsNkNBQTZDO0FBQzdDLHlEQUF5RDtBQUN6RCxrQ0FBa0M7QUFDbEMsTUFBTTtBQUNOLEtBQUs7QUFHRSxNQUFNQyxrQkFBa0JWLGtFQUFnQkEsQ0FBQyxvQkFBb0I7UUFBTyxFQUFFVyxNQUFNLEVBQUVSLE1BQU0sRUFBc0M7SUFDL0gsTUFBTUMsV0FBVyxNQUFNUSxNQUFPLGNBQWE7UUFDekNDLFFBQVE7UUFDUkMsTUFBTUMsS0FBS0MsU0FBUyxDQUFDO1lBQUVMO1lBQVFSO1FBQU87UUFDdENjLFNBQVM7WUFBRSxnQkFBZ0I7UUFBbUI7SUFDaEQ7SUFDQSxNQUFNVCxPQUFPLE1BQU1KLFNBQVNjLElBQUk7SUFDaEMsT0FBTztRQUNMLEdBQUdWLElBQUk7UUFDUFcsT0FBT1gsS0FBS1csS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsT0FBOEI7Z0JBQ25EbEIsUUFBUWtCLEtBQUtsQixNQUFNO1lBQ3JCO0lBQ0Y7QUFDRixHQUFHO0FBR0ksTUFBTW1CLGtCQUFrQnRCLGtFQUFnQkEsQ0FDN0MseUJBQ0E7UUFBTyxFQUFFVyxNQUFNLEVBQUVSLE1BQU0sRUFBRW9CLE9BQU8sRUFBdUQ7SUFDckYsTUFBTW5CLFdBQVcsTUFBTVEsTUFBTSxpQkFBaUI7UUFDNUNDLFFBQVE7UUFDVkMsTUFBUUMsS0FBS0MsU0FBUyxDQUFDO1lBQUNMO1lBQVFSO1lBQVFvQjtRQUFPO1FBQy9DTixTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO0lBQUU7SUFFaEQsTUFBTVQsT0FBTyxNQUFNSixTQUFTYyxJQUFJO0lBQ2hDLE9BQU87UUFDTCxHQUFHVixJQUFJO1FBQ1BnQixVQUFVaEIsS0FBS2dCLFFBQVEsQ0FBQ0osR0FBRyxDQUFDLENBQUNLLFVBQWlDO2dCQUM1RHRCLFFBQVFzQixRQUFRdEIsTUFBTTtZQUN4QjtJQUNGO0FBRUYsR0FDQTtBQWlCRixNQUFNdUIsZUFBMkI7SUFDL0JqQixPQUFPLEVBQUU7SUFDVGtCLFFBQVE7SUFDUkMsT0FBTztBQUNUO0FBRUEsTUFBTUMsYUFBYTlCLDZEQUFXQSxDQUFDO0lBQzdCK0IsTUFBTTtJQUNOSjtJQUNBSyxVQUFVLENBQUM7SUFDWEMsZUFBZSxDQUFDQztRQUNkQSxRQUNHQyxPQUFPLENBQUNoQyxXQUFXaUMsT0FBTyxFQUFFLENBQUNDO1lBQzVCQSxNQUFNVCxNQUFNLEdBQUc7UUFDakIsR0FDQ08sT0FBTyxDQUFDaEMsV0FBV21DLFNBQVMsRUFBRSxDQUFDRCxPQUFPRTtZQUNyQ0YsTUFBTVQsTUFBTSxHQUFHO1lBQ2ZTLE1BQU0zQixLQUFLLEdBQUc2QixPQUFPQyxPQUFPO1FBQzlCLEdBQ0NMLE9BQU8sQ0FBQ2hDLFdBQVdzQyxRQUFRLEVBQUUsQ0FBQ0osT0FBT0U7WUFDcENGLE1BQU1ULE1BQU0sR0FBRztRQUNoQixzQ0FBc0M7UUFDdkMsR0FDQ08sT0FBTyxDQUFDeEIsZ0JBQWdCMkIsU0FBUyxFQUFFLENBQUNELE9BQU9FO1lBQzFDLE1BQU1HLGNBQXFCSCxPQUFPQyxPQUFPO1lBQ3pDLE1BQU1HLFFBQVFOLE1BQU0zQixLQUFLLENBQUNrQyxTQUFTLENBQUMsQ0FBQ0MsSUFBTUEsRUFBRUMsR0FBRyxLQUFLSixZQUFZSSxHQUFHO1lBQ3BFLElBQUlILFVBQVUsQ0FBQyxHQUFHO2dCQUNoQk4sTUFBTTNCLEtBQUssQ0FBQ2lDLE1BQU0sR0FBRztvQkFDbkIsR0FBR04sTUFBTTNCLEtBQUssQ0FBQ2lDLE1BQU07b0JBQ3JCLEdBQUdELFdBQVc7b0JBQ2R0QixPQUFPc0IsWUFBWXRCLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLE9BQVU7NEJBQ3RDbEIsUUFBUWtCLEtBQUtsQixNQUFNO3dCQUNyQjtnQkFDRjtZQUNGO1FBQ0YsR0FDQytCLE9BQU8sQ0FBQ1osZ0JBQWdCZSxTQUFTLEVBQUUsQ0FBQ0QsT0FBT0U7WUFDMUMsTUFBTUcsY0FBY0gsT0FBT0MsT0FBTyxFQUFFLHFDQUFxQztZQUN6RSxNQUFNRyxRQUFRTixNQUFNM0IsS0FBSyxDQUFDa0MsU0FBUyxDQUFDLENBQUNDLElBQU1BLEVBQUVDLEdBQUcsS0FBS0osWUFBWUksR0FBRztZQUNwRSxJQUFJSCxVQUFVLENBQUMsR0FBRztnQkFDaEJOLE1BQU0zQixLQUFLLENBQUNpQyxNQUFNLEdBQUc7b0JBQ25CLEdBQUdOLE1BQU0zQixLQUFLLENBQUNpQyxNQUFNO29CQUNyQmxCLFVBQVVpQixZQUFZakIsUUFBUSxDQUFDSixHQUFHLENBQUNLLENBQUFBLFVBQVk7NEJBQzdDLEdBQUdBLE9BQU87NEJBQ1ZxQixTQUFTckIsUUFBUXFCLE9BQU87NEJBQ3hCM0MsUUFBUXNCLFFBQVF0QixNQUFNOzRCQUN0Qm9CLFNBQVNFLFFBQVFGLE9BQU87NEJBQ3hCd0IsV0FBV3RCLFFBQVFzQixTQUFTO3dCQUM5QjtnQkFDRjtZQUNGO1FBQ0Y7SUFHSjtBQUNGO0FBR0EsaUVBQWVsQixXQUFXbUIsT0FBTyxFQUFDIiwic291cmNlcyI6WyJDOlxcSW50ZXJrb25uZWt0XFxzcmNcXFNsaWNlXFxwb3N0c1NsaWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNsaWNlLCBjcmVhdGVBc3luY1RodW5rLCBQYXlsb2FkQWN0aW9uIH0gZnJvbSAnQHJlZHV4anMvdG9vbGtpdCc7XHJcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBQb3N0cywgeyBJUG9zdCB9IGZyb20gJ0AvbW9kZWxzL3Bvc3QnO1xyXG5pbXBvcnQgeyBSb290U3RhdGUgfSBmcm9tICdAL2FwcC9TdG9yZS9zdG9yZSc7XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hQb3N0cyA9IGNyZWF0ZUFzeW5jVGh1bmsoJ3Bvc3RzL2ZldGNoUG9zdHMnLCBhc3luYyAoe3VzZXJJZH06e3VzZXJJZDpzdHJpbmd9KSA9PiB7XHJcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCcvYXBpL2dldFBvc3RzJywpO1xyXG4gIGNvbnNvbGUubG9nKFwiU2xpY2UgY2FsbGVkOlwiLHJlc3BvbnNlLmRhdGEucG9zdHMpXHJcbiAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucG9zdHM7XHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IGZldGNoUG9zdHMgPSBjcmVhdGVBc3luY1RodW5rKFxyXG4vLyAgICdwb3N0cy9mZXRjaFBvc3RzJyxcclxuLy8gICBhc3luYyAoZmlsdGVyPzogeyB1c2VySWQ/OiBzdHJpbmc7IHBvc3RJZD86IHN0cmluZyB9KSA9PiB7XHJcbi8vICAgICBsZXQgdXJsID0gJy9hcGkvZ2V0UG9zdHMnO1xyXG5cclxuLy8gICAgIC8vIEFkZCBmaWx0ZXIgcGFyYW1ldGVycyB0byB0aGUgVVJMXHJcbi8vICAgICBpZiAoZmlsdGVyKSB7XHJcbi8vICAgICAgIGNvbnN0IHsgdXNlcklkLCBwb3N0SWQgfSA9IGZpbHRlcjtcclxuLy8gICAgICAgaWYgKHVzZXJJZCkge1xyXG4vLyAgICAgICAgIHVybCArPSBgP3VzZXJJZD0ke3VzZXJJZH1gOyAvLyBGZXRjaCBwb3N0cyBieSBhIHNwZWNpZmljIHVzZXJcclxuLy8gICAgICAgfVxyXG4vLyAgICAgICBpZiAocG9zdElkKSB7XHJcbi8vICAgICAgICAgdXJsICs9IGAke3VzZXJJZCA/ICcmJyA6ICc/J31wb3N0SWQ9JHtwb3N0SWR9YDsgLy8gRmV0Y2ggc3BlY2lmaWMgcG9zdCBieSBJRFxyXG4vLyAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcclxuLy8gICAgIGNvbnNvbGUubG9nKCdTbGljZSBjYWxsZWQ6JywgcmVzcG9uc2UuZGF0YS5wb3N0cyk7XHJcbi8vICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5wb3N0cztcclxuLy8gICB9XHJcbi8vICk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZUxpa2VBc3luYyA9IGNyZWF0ZUFzeW5jVGh1bmsoJ3Bvc3RzL3RvZ2dsZUxpa2UnLCBhc3luYyAoeyBwb3N0SWQsIHVzZXJJZCB9OiB7IHBvc3RJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZyB9KSA9PiB7XHJcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9saWtlc2AsIHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwb3N0SWQsIHVzZXJJZCB9KSxcclxuICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gIH0pO1xyXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLmRhdGEsXHJcbiAgICBsaWtlczogZGF0YS5saWtlcy5tYXAoKGxpa2U6IHsgdXNlcklkOiBzdHJpbmcgfSkgPT4gKHtcclxuICAgICAgdXNlcklkOiBsaWtlLnVzZXJJZCxcclxuICAgIH0pKSxcclxuICB9O1xyXG59KTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgYWRkQ29tbWVudEFzeW5jID0gY3JlYXRlQXN5bmNUaHVuayhcclxuICAncG9zdHMvYWRkQ29tbWVudEFzeW5jJyxcclxuICBhc3luYyAoeyBwb3N0SWQsIHVzZXJJZCwgY29udGVudCB9OiB7IHBvc3RJZDogc3RyaW5nOyB1c2VySWQ6IHN0cmluZzsgY29udGVudDogc3RyaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvY29tbWVudHMnLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLCBcclxuICAgIGJvZHk6ICAgSlNPTi5zdHJpbmdpZnkoe3Bvc3RJZCwgdXNlcklkLCBjb250ZW50fSksXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSB9KTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4uZGF0YSxcclxuICAgICAgY29tbWVudHM6IGRhdGEuY29tbWVudHMubWFwKChjb21tZW50OiB7IHVzZXJJZDogc3RyaW5nIH0pID0+ICh7XHJcbiAgICAgICAgdXNlcklkOiBjb21tZW50LnVzZXJJZCxcclxuICAgICAgfSkpLFxyXG4gICAgfTtcclxuICAgXHJcbiAgfVxyXG4pO1xyXG5cclxuXHJcblxyXG4vLyBpbnRlcmZhY2UgUG9zdCB7XHJcbi8vICAgaWQ6IHN0cmluZztcclxuLy8gICB1c2VybmFtZTogc3RyaW5nO1xyXG4vLyAgIGNvbnRlbnQ6IHN0cmluZztcclxuLy8gICBsaWtlczogbnVtYmVyO1xyXG4vLyB9XHJcblxyXG5pbnRlcmZhY2UgUG9zdHNTdGF0ZSB7XHJcbiAgcG9zdHM6IElQb3N0W107XHJcbiAgc3RhdHVzOiAnaWRsZScgfCAnbG9hZGluZycgfCAnc3VjY2VlZGVkJyB8ICdmYWlsZWQnO1xyXG4gIGVycm9yOiBzdHJpbmcgfCBudWxsO1xyXG59XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IFBvc3RzU3RhdGUgPSB7XHJcbiAgcG9zdHM6IFtdLFxyXG4gIHN0YXR1czogJ2lkbGUnLFxyXG4gIGVycm9yOiBudWxsLFxyXG59O1xyXG5cclxuY29uc3QgcG9zdHNTbGljZSA9IGNyZWF0ZVNsaWNlKHtcclxuICBuYW1lOiAncG9zdHMnLFxyXG4gIGluaXRpYWxTdGF0ZSxcclxuICByZWR1Y2Vyczoge30sXHJcbiAgZXh0cmFSZWR1Y2VyczogKGJ1aWxkZXIpID0+IHtcclxuICAgIGJ1aWxkZXJcclxuICAgICAgLmFkZENhc2UoZmV0Y2hQb3N0cy5wZW5kaW5nLCAoc3RhdGUpID0+IHtcclxuICAgICAgICBzdGF0ZS5zdGF0dXMgPSAnbG9hZGluZyc7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRDYXNlKGZldGNoUG9zdHMuZnVsZmlsbGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgICAgIHN0YXRlLnN0YXR1cyA9ICdzdWNjZWVkZWQnO1xyXG4gICAgICAgIHN0YXRlLnBvc3RzID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRDYXNlKGZldGNoUG9zdHMucmVqZWN0ZWQsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgc3RhdGUuc3RhdHVzID0gJ2ZhaWxlZCc7XHJcbiAgICAgICAvLyBzdGF0ZS5lcnJvciA9IGFjdGlvbi5lcnJvci5tZXNzYWdlO1xyXG4gICAgICB9KVxyXG4gICAgICAuYWRkQ2FzZSh0b2dnbGVMaWtlQXN5bmMuZnVsZmlsbGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRQb3N0OiBJUG9zdCA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3RhdGUucG9zdHMuZmluZEluZGV4KChwKSA9PiBwLl9pZCA9PT0gdXBkYXRlZFBvc3QuX2lkKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICBzdGF0ZS5wb3N0c1tpbmRleF0gPSB7XHJcbiAgICAgICAgICAgIC4uLnN0YXRlLnBvc3RzW2luZGV4XSxcclxuICAgICAgICAgICAgLi4udXBkYXRlZFBvc3QsXHJcbiAgICAgICAgICAgIGxpa2VzOiB1cGRhdGVkUG9zdC5saWtlcy5tYXAoKGxpa2UpID0+ICh7XHJcbiAgICAgICAgICAgICAgdXNlcklkOiBsaWtlLnVzZXJJZCxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRDYXNlKGFkZENvbW1lbnRBc3luYy5mdWxmaWxsZWQsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZFBvc3QgPSBhY3Rpb24ucGF5bG9hZDsgLy8gRW5zdXJlIHBheWxvYWQgaW5jbHVkZXMgYGNvbW1lbnRzYFxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3RhdGUucG9zdHMuZmluZEluZGV4KChwKSA9PiBwLl9pZCA9PT0gdXBkYXRlZFBvc3QuX2lkKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICBzdGF0ZS5wb3N0c1tpbmRleF0gPSB7XHJcbiAgICAgICAgICAgIC4uLnN0YXRlLnBvc3RzW2luZGV4XSxcclxuICAgICAgICAgICAgY29tbWVudHM6IHVwZGF0ZWRQb3N0LmNvbW1lbnRzLm1hcChjb21tZW50ID0+ICh7XHJcbiAgICAgICAgICAgICAgLi4uY29tbWVudCxcclxuICAgICAgICAgICAgICBwb3N0X2lkOiBjb21tZW50LnBvc3RfaWQsXHJcbiAgICAgICAgICAgICAgdXNlcklkOiBjb21tZW50LnVzZXJJZCxcclxuICAgICAgICAgICAgICBjb250ZW50OiBjb21tZW50LmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgY3JlYXRlZEF0OiBjb21tZW50LmNyZWF0ZWRBdCxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgfSxcclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcG9zdHNTbGljZS5yZWR1Y2VyO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlU2xpY2UiLCJjcmVhdGVBc3luY1RodW5rIiwiYXhpb3MiLCJmZXRjaFBvc3RzIiwidXNlcklkIiwicmVzcG9uc2UiLCJwb3N0IiwiY29uc29sZSIsImxvZyIsImRhdGEiLCJwb3N0cyIsInRvZ2dsZUxpa2VBc3luYyIsInBvc3RJZCIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJoZWFkZXJzIiwianNvbiIsImxpa2VzIiwibWFwIiwibGlrZSIsImFkZENvbW1lbnRBc3luYyIsImNvbnRlbnQiLCJjb21tZW50cyIsImNvbW1lbnQiLCJpbml0aWFsU3RhdGUiLCJzdGF0dXMiLCJlcnJvciIsInBvc3RzU2xpY2UiLCJuYW1lIiwicmVkdWNlcnMiLCJleHRyYVJlZHVjZXJzIiwiYnVpbGRlciIsImFkZENhc2UiLCJwZW5kaW5nIiwic3RhdGUiLCJmdWxmaWxsZWQiLCJhY3Rpb24iLCJwYXlsb2FkIiwicmVqZWN0ZWQiLCJ1cGRhdGVkUG9zdCIsImluZGV4IiwiZmluZEluZGV4IiwicCIsIl9pZCIsInBvc3RfaWQiLCJjcmVhdGVkQXQiLCJyZWR1Y2VyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/Slice/postsSlice.ts\n"));

/***/ })

});