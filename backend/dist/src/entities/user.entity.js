"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
id: string;
email: string;
password: string;
name: string;
role: UserRole;
created_at: Date;
updated_at: Date;
//# sourceMappingURL=user.entity.js.map