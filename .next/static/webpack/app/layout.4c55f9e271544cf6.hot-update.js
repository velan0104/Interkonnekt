"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/Slice/postsSlice.ts":
/*!*********************************!*\
  !*** ./src/Slice/postsSlice.ts ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addCommentAsync: () => (/* binding */ addCommentAsync),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   fetchPosts: () => (/* binding */ fetchPosts),\n/* harmony export */   toggleLikeAsync: () => (/* binding */ toggleLikeAsync)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n\nconst fetchPosts = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/fetchPosts', async (param)=>{\n    let { userId } = param;\n    const response = await fetch('/api/getPosts', {\n        method: 'POST',\n        body: JSON.stringify()\n    });\n    console.log(\"Slice called:\", response.data.posts);\n    return response.data.posts;\n});\n// export const fetchPosts = createAsyncThunk(\n//   'posts/fetchPosts',\n//   async (filter?: { userId?: string; postId?: string }) => {\n//     let url = '/api/getPosts';\n//     // Add filter parameters to the URL\n//     if (filter) {\n//       const { userId, postId } = filter;\n//       if (userId) {\n//         url += `?userId=${userId}`; // Fetch posts by a specific user\n//       }\n//       if (postId) {\n//         url += `${userId ? '&' : '?'}postId=${postId}`; // Fetch specific post by ID\n//       }\n//     }\n//     const response = await axios.get(url);\n//     console.log('Slice called:', response.data.posts);\n//     return response.data.posts;\n//   }\n// );\nconst toggleLikeAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/toggleLike', async (param)=>{\n    let { postId, userId } = param;\n    const response = await fetch(\"/api/likes\", {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        likes: data.likes.map((like)=>({\n                userId: like.userId\n            }))\n    };\n});\nconst addCommentAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/addCommentAsync', async (param)=>{\n    let { postId, userId, content } = param;\n    const response = await fetch('/api/comments', {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId,\n            content\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        comments: data.comments.map((comment)=>({\n                userId: comment.userId\n            }))\n    };\n});\nconst initialState = {\n    posts: [],\n    status: 'idle',\n    error: null\n};\nconst postsSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: 'posts',\n    initialState,\n    reducers: {},\n    extraReducers: (builder)=>{\n        builder.addCase(fetchPosts.pending, (state)=>{\n            state.status = 'loading';\n        }).addCase(fetchPosts.fulfilled, (state, action)=>{\n            state.status = 'succeeded';\n            state.posts = action.payload;\n        }).addCase(fetchPosts.rejected, (state, action)=>{\n            state.status = 'failed';\n        // state.error = action.error.message;\n        }).addCase(toggleLikeAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload;\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    ...updatedPost,\n                    likes: updatedPost.likes.map((like)=>({\n                            userId: like.userId\n                        }))\n                };\n            }\n        }).addCase(addCommentAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload; // Ensure payload includes `comments`\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    comments: updatedPost.comments.map((comment)=>({\n                            ...comment,\n                            post_id: comment.post_id,\n                            userId: comment.userId,\n                            content: comment.content,\n                            createdAt: comment.createdAt\n                        }))\n                };\n            }\n        });\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (postsSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9TbGljZS9wb3N0c1NsaWNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWdGO0FBS3pFLE1BQU1FLGFBQWFELGtFQUFnQkEsQ0FBQyxvQkFBb0I7UUFBTyxFQUFDRSxNQUFNLEVBQWlCO0lBQzVGLE1BQU1DLFdBQVcsTUFBTUMsTUFBTSxpQkFBZ0I7UUFDM0NDLFFBQVE7UUFDUkMsTUFBTUMsS0FBS0MsU0FBUztJQUN0QjtJQUNBQyxRQUFRQyxHQUFHLENBQUMsaUJBQWdCUCxTQUFTUSxJQUFJLENBQUNDLEtBQUs7SUFDL0MsT0FBT1QsU0FBU1EsSUFBSSxDQUFDQyxLQUFLO0FBQzVCLEdBQUc7QUFFSCw4Q0FBOEM7QUFDOUMsd0JBQXdCO0FBQ3hCLCtEQUErRDtBQUMvRCxpQ0FBaUM7QUFFakMsMENBQTBDO0FBQzFDLG9CQUFvQjtBQUNwQiwyQ0FBMkM7QUFDM0Msc0JBQXNCO0FBQ3RCLHdFQUF3RTtBQUN4RSxVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLHVGQUF1RjtBQUN2RixVQUFVO0FBQ1YsUUFBUTtBQUVSLDZDQUE2QztBQUM3Qyx5REFBeUQ7QUFDekQsa0NBQWtDO0FBQ2xDLE1BQU07QUFDTixLQUFLO0FBR0UsTUFBTUMsa0JBQWtCYixrRUFBZ0JBLENBQUMsb0JBQW9CO1FBQU8sRUFBRWMsTUFBTSxFQUFFWixNQUFNLEVBQXNDO0lBQy9ILE1BQU1DLFdBQVcsTUFBTUMsTUFBTyxjQUFhO1FBQ3pDQyxRQUFRO1FBQ1JDLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQztZQUFFTTtZQUFRWjtRQUFPO1FBQ3RDYSxTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO0lBQ2hEO0lBQ0EsTUFBTUosT0FBTyxNQUFNUixTQUFTYSxJQUFJO0lBQ2hDLE9BQU87UUFDTCxHQUFHTCxJQUFJO1FBQ1BNLE9BQU9OLEtBQUtNLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLE9BQThCO2dCQUNuRGpCLFFBQVFpQixLQUFLakIsTUFBTTtZQUNy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c0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2xpY2UsIGNyZWF0ZUFzeW5jVGh1bmssIFBheWxvYWRBY3Rpb24gfSBmcm9tICdAcmVkdXhqcy90b29sa2l0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFBvc3RzLCB7IElQb3N0IH0gZnJvbSAnQC9tb2RlbHMvcG9zdCc7XHJcbmltcG9ydCB7IFJvb3RTdGF0ZSB9IGZyb20gJ0AvYXBwL1N0b3JlL3N0b3JlJztcclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3RzID0gY3JlYXRlQXN5bmNUaHVuaygncG9zdHMvZmV0Y2hQb3N0cycsIGFzeW5jICh7dXNlcklkfTp7dXNlcklkOnN0cmluZ30pID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2dldFBvc3RzJyx7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KClcclxuICB9KTtcclxuICBjb25zb2xlLmxvZyhcIlNsaWNlIGNhbGxlZDpcIixyZXNwb25zZS5kYXRhLnBvc3RzKVxyXG4gIHJldHVybiByZXNwb25zZS5kYXRhLnBvc3RzO1xyXG59KTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBmZXRjaFBvc3RzID0gY3JlYXRlQXN5bmNUaHVuayhcclxuLy8gICAncG9zdHMvZmV0Y2hQb3N0cycsXHJcbi8vICAgYXN5bmMgKGZpbHRlcj86IHsgdXNlcklkPzogc3RyaW5nOyBwb3N0SWQ/OiBzdHJpbmcgfSkgPT4ge1xyXG4vLyAgICAgbGV0IHVybCA9ICcvYXBpL2dldFBvc3RzJztcclxuXHJcbi8vICAgICAvLyBBZGQgZmlsdGVyIHBhcmFtZXRlcnMgdG8gdGhlIFVSTFxyXG4vLyAgICAgaWYgKGZpbHRlcikge1xyXG4vLyAgICAgICBjb25zdCB7IHVzZXJJZCwgcG9zdElkIH0gPSBmaWx0ZXI7XHJcbi8vICAgICAgIGlmICh1c2VySWQpIHtcclxuLy8gICAgICAgICB1cmwgKz0gYD91c2VySWQ9JHt1c2VySWR9YDsgLy8gRmV0Y2ggcG9zdHMgYnkgYSBzcGVjaWZpYyB1c2VyXHJcbi8vICAgICAgIH1cclxuLy8gICAgICAgaWYgKHBvc3RJZCkge1xyXG4vLyAgICAgICAgIHVybCArPSBgJHt1c2VySWQgPyAnJicgOiAnPyd9cG9zdElkPSR7cG9zdElkfWA7IC8vIEZldGNoIHNwZWNpZmljIHBvc3QgYnkgSURcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCk7XHJcbi8vICAgICBjb25zb2xlLmxvZygnU2xpY2UgY2FsbGVkOicsIHJlc3BvbnNlLmRhdGEucG9zdHMpO1xyXG4vLyAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucG9zdHM7XHJcbi8vICAgfVxyXG4vLyApO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB0b2dnbGVMaWtlQXN5bmMgPSBjcmVhdGVBc3luY1RodW5rKCdwb3N0cy90b2dnbGVMaWtlJywgYXN5bmMgKHsgcG9zdElkLCB1c2VySWQgfTogeyBwb3N0SWQ6IHN0cmluZywgdXNlcklkOiBzdHJpbmcgfSkgPT4ge1xyXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvbGlrZXNgLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcG9zdElkLCB1c2VySWQgfSksXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICB9KTtcclxuICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gIHJldHVybiB7XHJcbiAgICAuLi5kYXRhLFxyXG4gICAgbGlrZXM6IGRhdGEubGlrZXMubWFwKChsaWtlOiB7IHVzZXJJZDogc3RyaW5nIH0pID0+ICh7XHJcbiAgICAgIHVzZXJJZDogbGlrZS51c2VySWQsXHJcbiAgICB9KSksXHJcbiAgfTtcclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZENvbW1lbnRBc3luYyA9IGNyZWF0ZUFzeW5jVGh1bmsoXHJcbiAgJ3Bvc3RzL2FkZENvbW1lbnRBc3luYycsXHJcbiAgYXN5bmMgKHsgcG9zdElkLCB1c2VySWQsIGNvbnRlbnQgfTogeyBwb3N0SWQ6IHN0cmluZzsgdXNlcklkOiBzdHJpbmc7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2NvbW1lbnRzJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJywgXHJcbiAgICBib2R5OiAgIEpTT04uc3RyaW5naWZ5KHtwb3N0SWQsIHVzZXJJZCwgY29udGVudH0pLFxyXG4gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLmRhdGEsXHJcbiAgICAgIGNvbW1lbnRzOiBkYXRhLmNvbW1lbnRzLm1hcCgoY29tbWVudDogeyB1c2VySWQ6IHN0cmluZyB9KSA9PiAoe1xyXG4gICAgICAgIHVzZXJJZDogY29tbWVudC51c2VySWQsXHJcbiAgICAgIH0pKSxcclxuICAgIH07XHJcbiAgIFxyXG4gIH1cclxuKTtcclxuXHJcblxyXG5cclxuLy8gaW50ZXJmYWNlIFBvc3Qge1xyXG4vLyAgIGlkOiBzdHJpbmc7XHJcbi8vICAgdXNlcm5hbWU6IHN0cmluZztcclxuLy8gICBjb250ZW50OiBzdHJpbmc7XHJcbi8vICAgbGlrZXM6IG51bWJlcjtcclxuLy8gfVxyXG5cclxuaW50ZXJmYWNlIFBvc3RzU3RhdGUge1xyXG4gIHBvc3RzOiBJUG9zdFtdO1xyXG4gIHN0YXR1czogJ2lkbGUnIHwgJ2xvYWRpbmcnIHwgJ3N1Y2NlZWRlZCcgfCAnZmFpbGVkJztcclxuICBlcnJvcjogc3RyaW5nIHwgbnVsbDtcclxufVxyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBQb3N0c1N0YXRlID0ge1xyXG4gIHBvc3RzOiBbXSxcclxuICBzdGF0dXM6ICdpZGxlJyxcclxuICBlcnJvcjogbnVsbCxcclxufTtcclxuXHJcbmNvbnN0IHBvc3RzU2xpY2UgPSBjcmVhdGVTbGljZSh7XHJcbiAgbmFtZTogJ3Bvc3RzJyxcclxuICBpbml0aWFsU3RhdGUsXHJcbiAgcmVkdWNlcnM6IHt9LFxyXG4gIGV4dHJhUmVkdWNlcnM6IChidWlsZGVyKSA9PiB7XHJcbiAgICBidWlsZGVyXHJcbiAgICAgIC5hZGRDYXNlKGZldGNoUG9zdHMucGVuZGluZywgKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgc3RhdGUuc3RhdHVzID0gJ2xvYWRpbmcnO1xyXG4gICAgICB9KVxyXG4gICAgICAuYWRkQ2FzZShmZXRjaFBvc3RzLmZ1bGZpbGxlZCwgKHN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgICAgICBzdGF0ZS5zdGF0dXMgPSAnc3VjY2VlZGVkJztcclxuICAgICAgICBzdGF0ZS5wb3N0cyA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICB9KVxyXG4gICAgICAuYWRkQ2FzZShmZXRjaFBvc3RzLnJlamVjdGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgICAgIHN0YXRlLnN0YXR1cyA9ICdmYWlsZWQnO1xyXG4gICAgICAgLy8gc3RhdGUuZXJyb3IgPSBhY3Rpb24uZXJyb3IubWVzc2FnZTtcclxuICAgICAgfSlcclxuICAgICAgLmFkZENhc2UodG9nZ2xlTGlrZUFzeW5jLmZ1bGZpbGxlZCwgKHN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkUG9zdDogSVBvc3QgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHN0YXRlLnBvc3RzLmZpbmRJbmRleCgocCkgPT4gcC5faWQgPT09IHVwZGF0ZWRQb3N0Ll9pZCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgc3RhdGUucG9zdHNbaW5kZXhdID0ge1xyXG4gICAgICAgICAgICAuLi5zdGF0ZS5wb3N0c1tpbmRleF0sXHJcbiAgICAgICAgICAgIC4uLnVwZGF0ZWRQb3N0LFxyXG4gICAgICAgICAgICBsaWtlczogdXBkYXRlZFBvc3QubGlrZXMubWFwKChsaWtlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIHVzZXJJZDogbGlrZS51c2VySWQsXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuYWRkQ2FzZShhZGRDb21tZW50QXN5bmMuZnVsZmlsbGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRQb3N0ID0gYWN0aW9uLnBheWxvYWQ7IC8vIEVuc3VyZSBwYXlsb2FkIGluY2x1ZGVzIGBjb21tZW50c2BcclxuICAgICAgICBjb25zdCBpbmRleCA9IHN0YXRlLnBvc3RzLmZpbmRJbmRleCgocCkgPT4gcC5faWQgPT09IHVwZGF0ZWRQb3N0Ll9pZCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgc3RhdGUucG9zdHNbaW5kZXhdID0ge1xyXG4gICAgICAgICAgICAuLi5zdGF0ZS5wb3N0c1tpbmRleF0sXHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiB1cGRhdGVkUG9zdC5jb21tZW50cy5tYXAoY29tbWVudCA9PiAoe1xyXG4gICAgICAgICAgICAgIC4uLmNvbW1lbnQsXHJcbiAgICAgICAgICAgICAgcG9zdF9pZDogY29tbWVudC5wb3N0X2lkLFxyXG4gICAgICAgICAgICAgIHVzZXJJZDogY29tbWVudC51c2VySWQsXHJcbiAgICAgICAgICAgICAgY29udGVudDogY29tbWVudC5jb250ZW50LFxyXG4gICAgICAgICAgICAgIGNyZWF0ZWRBdDogY29tbWVudC5jcmVhdGVkQXQsXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBvc3RzU2xpY2UucmVkdWNlcjtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZVNsaWNlIiwiY3JlYXRlQXN5bmNUaHVuayIsImZldGNoUG9zdHMiLCJ1c2VySWQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsInBvc3RzIiwidG9nZ2xlTGlrZUFzeW5jIiwicG9zdElkIiwiaGVhZGVycyIsImpzb24iLCJsaWtlcyIsIm1hcCIsImxpa2UiLCJhZGRDb21tZW50QXN5bmMiLCJjb250ZW50IiwiY29tbWVudHMiLCJjb21tZW50IiwiaW5pdGlhbFN0YXRlIiwic3RhdHVzIiwiZXJyb3IiLCJwb3N0c1NsaWNlIiwibmFtZSIsInJlZHVjZXJzIiwiZXh0cmFSZWR1Y2VycyIsImJ1aWxkZXIiLCJhZGRDYXNlIiwicGVuZGluZyIsInN0YXRlIiwiZnVsZmlsbGVkIiwiYWN0aW9uIiwicGF5bG9hZCIsInJlamVjdGVkIiwidXBkYXRlZFBvc3QiLCJpbmRleCIsImZpbmRJbmRleCIsInAiLCJfaWQiLCJwb3N0X2lkIiwiY3JlYXRlZEF0IiwicmVkdWNlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/Slice/postsSlice.ts\n"));

/***/ })

});