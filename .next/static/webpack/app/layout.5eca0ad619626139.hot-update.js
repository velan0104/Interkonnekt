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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addCommentAsync: () => (/* binding */ addCommentAsync),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   fetchPosts: () => (/* binding */ fetchPosts),\n/* harmony export */   toggleLikeAsync: () => (/* binding */ toggleLikeAsync)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n\nconst fetchPosts = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/fetchPosts', async (param)=>{\n    let { userId } = param;\n    const response = await fetch('/api/getPosts', {\n        method: 'POST',\n        body: JSON.stringify({\n            userId: userId\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = console.log(\"Slice called:\", response.data.posts);\n    return response.data.posts;\n});\n// export const fetchPosts = createAsyncThunk(\n//   'posts/fetchPosts',\n//   async (filter?: { userId?: string; postId?: string }) => {\n//     let url = '/api/getPosts';\n//     // Add filter parameters to the URL\n//     if (filter) {\n//       const { userId, postId } = filter;\n//       if (userId) {\n//         url += `?userId=${userId}`; // Fetch posts by a specific user\n//       }\n//       if (postId) {\n//         url += `${userId ? '&' : '?'}postId=${postId}`; // Fetch specific post by ID\n//       }\n//     }\n//     const response = await axios.get(url);\n//     console.log('Slice called:', response.data.posts);\n//     return response.data.posts;\n//   }\n// );\nconst toggleLikeAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/toggleLike', async (param)=>{\n    let { postId, userId } = param;\n    const response = await fetch(\"/api/likes\", {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        likes: data.likes.map((like)=>({\n                userId: like.userId\n            }))\n    };\n});\nconst addCommentAsync = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAsyncThunk)('posts/addCommentAsync', async (param)=>{\n    let { postId, userId, content } = param;\n    const response = await fetch('/api/comments', {\n        method: 'POST',\n        body: JSON.stringify({\n            postId,\n            userId,\n            content\n        }),\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n    const data = await response.json();\n    return {\n        ...data,\n        comments: data.comments.map((comment)=>({\n                userId: comment.userId\n            }))\n    };\n});\nconst initialState = {\n    posts: [],\n    status: 'idle',\n    error: null\n};\nconst postsSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: 'posts',\n    initialState,\n    reducers: {},\n    extraReducers: (builder)=>{\n        builder.addCase(fetchPosts.pending, (state)=>{\n            state.status = 'loading';\n        }).addCase(fetchPosts.fulfilled, (state, action)=>{\n            state.status = 'succeeded';\n            state.posts = action.payload;\n        }).addCase(fetchPosts.rejected, (state, action)=>{\n            state.status = 'failed';\n        // state.error = action.error.message;\n        }).addCase(toggleLikeAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload;\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    ...updatedPost,\n                    likes: updatedPost.likes.map((like)=>({\n                            userId: like.userId\n                        }))\n                };\n            }\n        }).addCase(addCommentAsync.fulfilled, (state, action)=>{\n            const updatedPost = action.payload; // Ensure payload includes `comments`\n            const index = state.posts.findIndex((p)=>p._id === updatedPost._id);\n            if (index !== -1) {\n                state.posts[index] = {\n                    ...state.posts[index],\n                    comments: updatedPost.comments.map((comment)=>({\n                            ...comment,\n                            post_id: comment.post_id,\n                            userId: comment.userId,\n                            content: comment.content,\n                            createdAt: comment.createdAt\n                        }))\n                };\n            }\n        });\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (postsSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9TbGljZS9wb3N0c1NsaWNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWdGO0FBS3pFLE1BQU1FLGFBQWFELGtFQUFnQkEsQ0FBQyxvQkFBb0I7UUFBTyxFQUFDRSxNQUFNLEVBQWlCO0lBQzVGLE1BQU1DLFdBQVcsTUFBTUMsTUFBTSxpQkFBZ0I7UUFDM0NDLFFBQVE7UUFDUkMsTUFBTUMsS0FBS0MsU0FBUyxDQUFDO1lBQUNOLFFBQU9BO1FBQU07UUFDbkNPLFNBQVM7WUFBQyxnQkFBZ0I7UUFBa0I7SUFDOUM7SUFDQSxNQUFNQyxPQUNOQyxRQUFRQyxHQUFHLENBQUMsaUJBQWdCVCxTQUFTTyxJQUFJLENBQUNHLEtBQUs7SUFDL0MsT0FBT1YsU0FBU08sSUFBSSxDQUFDRyxLQUFLO0FBQzVCLEdBQUc7QUFFSCw4Q0FBOEM7QUFDOUMsd0JBQXdCO0FBQ3hCLCtEQUErRDtBQUMvRCxpQ0FBaUM7QUFFakMsMENBQTBDO0FBQzFDLG9CQUFvQjtBQUNwQiwyQ0FBMkM7QUFDM0Msc0JBQXNCO0FBQ3RCLHdFQUF3RTtBQUN4RSxVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLHVGQUF1RjtBQUN2RixVQUFVO0FBQ1YsUUFBUTtBQUVSLDZDQUE2QztBQUM3Qyx5REFBeUQ7QUFDekQsa0NBQWtDO0FBQ2xDLE1BQU07QUFDTixLQUFLO0FBR0UsTUFBTUMsa0JBQWtCZCxrRUFBZ0JBLENBQUMsb0JBQW9CO1FBQU8sRUFBRWUsTUFBTSxFQUFFYixNQUFNLEVBQXNDO0lBQy9ILE1BQU1DLFdBQVcsTUFBTUMsTUFBTyxjQUFhO1FBQ3pDQyxRQUFRO1FBQ1JDLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQztZQUFFTztZQUFRYjtRQUFPO1FBQ3RDTyxTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO0lBQ2hEO0lBQ0EsTUFBTUMsT0FBTyxNQUFNUCxTQUFTYSxJQUFJO0lBQ2hDLE9BQU87UUFDTCxHQUFHTixJQUFJO1FBQ1BPLE9BQU9QLEtBQUtPLEtB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b3VyY2VzIjpbIkM6XFxJbnRlcmtvbm5la3RcXHNyY1xcU2xpY2VcXHBvc3RzU2xpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2xpY2UsIGNyZWF0ZUFzeW5jVGh1bmssIFBheWxvYWRBY3Rpb24gfSBmcm9tICdAcmVkdXhqcy90b29sa2l0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFBvc3RzLCB7IElQb3N0IH0gZnJvbSAnQC9tb2RlbHMvcG9zdCc7XHJcbmltcG9ydCB7IFJvb3RTdGF0ZSB9IGZyb20gJ0AvYXBwL1N0b3JlL3N0b3JlJztcclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3RzID0gY3JlYXRlQXN5bmNUaHVuaygncG9zdHMvZmV0Y2hQb3N0cycsIGFzeW5jICh7dXNlcklkfTp7dXNlcklkOnN0cmluZ30pID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2dldFBvc3RzJyx7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHt1c2VySWQ6dXNlcklkfSksXHJcbiAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICB9KTtcclxuICBjb25zdCBkYXRhID0gXHJcbiAgY29uc29sZS5sb2coXCJTbGljZSBjYWxsZWQ6XCIscmVzcG9uc2UuZGF0YS5wb3N0cylcclxuICByZXR1cm4gcmVzcG9uc2UuZGF0YS5wb3N0cztcclxufSk7XHJcblxyXG4vLyBleHBvcnQgY29uc3QgZmV0Y2hQb3N0cyA9IGNyZWF0ZUFzeW5jVGh1bmsoXHJcbi8vICAgJ3Bvc3RzL2ZldGNoUG9zdHMnLFxyXG4vLyAgIGFzeW5jIChmaWx0ZXI/OiB7IHVzZXJJZD86IHN0cmluZzsgcG9zdElkPzogc3RyaW5nIH0pID0+IHtcclxuLy8gICAgIGxldCB1cmwgPSAnL2FwaS9nZXRQb3N0cyc7XHJcblxyXG4vLyAgICAgLy8gQWRkIGZpbHRlciBwYXJhbWV0ZXJzIHRvIHRoZSBVUkxcclxuLy8gICAgIGlmIChmaWx0ZXIpIHtcclxuLy8gICAgICAgY29uc3QgeyB1c2VySWQsIHBvc3RJZCB9ID0gZmlsdGVyO1xyXG4vLyAgICAgICBpZiAodXNlcklkKSB7XHJcbi8vICAgICAgICAgdXJsICs9IGA/dXNlcklkPSR7dXNlcklkfWA7IC8vIEZldGNoIHBvc3RzIGJ5IGEgc3BlY2lmaWMgdXNlclxyXG4vLyAgICAgICB9XHJcbi8vICAgICAgIGlmIChwb3N0SWQpIHtcclxuLy8gICAgICAgICB1cmwgKz0gYCR7dXNlcklkID8gJyYnIDogJz8nfXBvc3RJZD0ke3Bvc3RJZH1gOyAvLyBGZXRjaCBzcGVjaWZpYyBwb3N0IGJ5IElEXHJcbi8vICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwpO1xyXG4vLyAgICAgY29uc29sZS5sb2coJ1NsaWNlIGNhbGxlZDonLCByZXNwb25zZS5kYXRhLnBvc3RzKTtcclxuLy8gICAgIHJldHVybiByZXNwb25zZS5kYXRhLnBvc3RzO1xyXG4vLyAgIH1cclxuLy8gKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdG9nZ2xlTGlrZUFzeW5jID0gY3JlYXRlQXN5bmNUaHVuaygncG9zdHMvdG9nZ2xlTGlrZScsIGFzeW5jICh7IHBvc3RJZCwgdXNlcklkIH06IHsgcG9zdElkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nIH0pID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2xpa2VzYCwge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBvc3RJZCwgdXNlcklkIH0pLFxyXG4gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgfSk7XHJcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICByZXR1cm4ge1xyXG4gICAgLi4uZGF0YSxcclxuICAgIGxpa2VzOiBkYXRhLmxpa2VzLm1hcCgobGlrZTogeyB1c2VySWQ6IHN0cmluZyB9KSA9PiAoe1xyXG4gICAgICB1c2VySWQ6IGxpa2UudXNlcklkLFxyXG4gICAgfSkpLFxyXG4gIH07XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBhZGRDb21tZW50QXN5bmMgPSBjcmVhdGVBc3luY1RodW5rKFxyXG4gICdwb3N0cy9hZGRDb21tZW50QXN5bmMnLFxyXG4gIGFzeW5jICh7IHBvc3RJZCwgdXNlcklkLCBjb250ZW50IH06IHsgcG9zdElkOiBzdHJpbmc7IHVzZXJJZDogc3RyaW5nOyBjb250ZW50OiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9jb21tZW50cycsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsIFxyXG4gICAgYm9keTogICBKU09OLnN0cmluZ2lmeSh7cG9zdElkLCB1c2VySWQsIGNvbnRlbnR9KSxcclxuICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xyXG5cclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5kYXRhLFxyXG4gICAgICBjb21tZW50czogZGF0YS5jb21tZW50cy5tYXAoKGNvbW1lbnQ6IHsgdXNlcklkOiBzdHJpbmcgfSkgPT4gKHtcclxuICAgICAgICB1c2VySWQ6IGNvbW1lbnQudXNlcklkLFxyXG4gICAgICB9KSksXHJcbiAgICB9O1xyXG4gICBcclxuICB9XHJcbik7XHJcblxyXG5cclxuXHJcbi8vIGludGVyZmFjZSBQb3N0IHtcclxuLy8gICBpZDogc3RyaW5nO1xyXG4vLyAgIHVzZXJuYW1lOiBzdHJpbmc7XHJcbi8vICAgY29udGVudDogc3RyaW5nO1xyXG4vLyAgIGxpa2VzOiBudW1iZXI7XHJcbi8vIH1cclxuXHJcbmludGVyZmFjZSBQb3N0c1N0YXRlIHtcclxuICBwb3N0czogSVBvc3RbXTtcclxuICBzdGF0dXM6ICdpZGxlJyB8ICdsb2FkaW5nJyB8ICdzdWNjZWVkZWQnIHwgJ2ZhaWxlZCc7XHJcbiAgZXJyb3I6IHN0cmluZyB8IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZTogUG9zdHNTdGF0ZSA9IHtcclxuICBwb3N0czogW10sXHJcbiAgc3RhdHVzOiAnaWRsZScsXHJcbiAgZXJyb3I6IG51bGwsXHJcbn07XHJcblxyXG5jb25zdCBwb3N0c1NsaWNlID0gY3JlYXRlU2xpY2Uoe1xyXG4gIG5hbWU6ICdwb3N0cycsXHJcbiAgaW5pdGlhbFN0YXRlLFxyXG4gIHJlZHVjZXJzOiB7fSxcclxuICBleHRyYVJlZHVjZXJzOiAoYnVpbGRlcikgPT4ge1xyXG4gICAgYnVpbGRlclxyXG4gICAgICAuYWRkQ2FzZShmZXRjaFBvc3RzLnBlbmRpbmcsIChzdGF0ZSkgPT4ge1xyXG4gICAgICAgIHN0YXRlLnN0YXR1cyA9ICdsb2FkaW5nJztcclxuICAgICAgfSlcclxuICAgICAgLmFkZENhc2UoZmV0Y2hQb3N0cy5mdWxmaWxsZWQsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgc3RhdGUuc3RhdHVzID0gJ3N1Y2NlZWRlZCc7XHJcbiAgICAgICAgc3RhdGUucG9zdHMgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgfSlcclxuICAgICAgLmFkZENhc2UoZmV0Y2hQb3N0cy5yZWplY3RlZCwgKHN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgICAgICBzdGF0ZS5zdGF0dXMgPSAnZmFpbGVkJztcclxuICAgICAgIC8vIHN0YXRlLmVycm9yID0gYWN0aW9uLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRDYXNlKHRvZ2dsZUxpa2VBc3luYy5mdWxmaWxsZWQsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZFBvc3Q6IElQb3N0ID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS5wb3N0cy5maW5kSW5kZXgoKHApID0+IHAuX2lkID09PSB1cGRhdGVkUG9zdC5faWQpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgIHN0YXRlLnBvc3RzW2luZGV4XSA9IHtcclxuICAgICAgICAgICAgLi4uc3RhdGUucG9zdHNbaW5kZXhdLFxyXG4gICAgICAgICAgICAuLi51cGRhdGVkUG9zdCxcclxuICAgICAgICAgICAgbGlrZXM6IHVwZGF0ZWRQb3N0Lmxpa2VzLm1hcCgobGlrZSkgPT4gKHtcclxuICAgICAgICAgICAgICB1c2VySWQ6IGxpa2UudXNlcklkLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmFkZENhc2UoYWRkQ29tbWVudEFzeW5jLmZ1bGZpbGxlZCwgKHN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkUG9zdCA9IGFjdGlvbi5wYXlsb2FkOyAvLyBFbnN1cmUgcGF5bG9hZCBpbmNsdWRlcyBgY29tbWVudHNgXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS5wb3N0cy5maW5kSW5kZXgoKHApID0+IHAuX2lkID09PSB1cGRhdGVkUG9zdC5faWQpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgIHN0YXRlLnBvc3RzW2luZGV4XSA9IHtcclxuICAgICAgICAgICAgLi4uc3RhdGUucG9zdHNbaW5kZXhdLFxyXG4gICAgICAgICAgICBjb21tZW50czogdXBkYXRlZFBvc3QuY29tbWVudHMubWFwKGNvbW1lbnQgPT4gKHtcclxuICAgICAgICAgICAgICAuLi5jb21tZW50LFxyXG4gICAgICAgICAgICAgIHBvc3RfaWQ6IGNvbW1lbnQucG9zdF9pZCxcclxuICAgICAgICAgICAgICB1c2VySWQ6IGNvbW1lbnQudXNlcklkLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbW1lbnQuY29udGVudCxcclxuICAgICAgICAgICAgICBjcmVhdGVkQXQ6IGNvbW1lbnQuY3JlYXRlZEF0LFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICB9LFxyXG59KTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBwb3N0c1NsaWNlLnJlZHVjZXI7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVTbGljZSIsImNyZWF0ZUFzeW5jVGh1bmsiLCJmZXRjaFBvc3RzIiwidXNlcklkIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiaGVhZGVycyIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwicG9zdHMiLCJ0b2dnbGVMaWtlQXN5bmMiLCJwb3N0SWQiLCJqc29uIiwibGlrZXMiLCJtYXAiLCJsaWtlIiwiYWRkQ29tbWVudEFzeW5jIiwiY29udGVudCIsImNvbW1lbnRzIiwiY29tbWVudCIsImluaXRpYWxTdGF0ZSIsInN0YXR1cyIsImVycm9yIiwicG9zdHNTbGljZSIsIm5hbWUiLCJyZWR1Y2VycyIsImV4dHJhUmVkdWNlcnMiLCJidWlsZGVyIiwiYWRkQ2FzZSIsInBlbmRpbmciLCJzdGF0ZSIsImZ1bGZpbGxlZCIsImFjdGlvbiIsInBheWxvYWQiLCJyZWplY3RlZCIsInVwZGF0ZWRQb3N0IiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJwIiwiX2lkIiwicG9zdF9pZCIsImNyZWF0ZWRBdCIsInJlZHVjZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/Slice/postsSlice.ts\n"));

/***/ })

});