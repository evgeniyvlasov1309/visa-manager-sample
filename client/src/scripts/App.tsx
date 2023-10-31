import { Auth } from "@pages/auth/auth";
import { PATHS } from "./router";

import MainLayout from "@pages/layout/MainLayout/MainLayout";
import { PrivateOutlet } from "@shared/components/utility/PrivateRoute/PrivateRoute";

import React from "react";

import AdminPage from "@pages/admin/admin";
import { BotOwnersPage } from "@pages/botowners/botOwners";
import { EmployeePage } from "@pages/employee/employee";
import { EmployeesPage } from "@pages/employees/employees";
import FaqPage from "@pages/faq/faq";
import { HomePage } from "@pages/home/home";
import AuthLayout from "@pages/layout/AuthLayout/AuthLayout";
import NotificationsPage from "@pages/notifications/notifications";
import PermanentFieldsPage from "@pages/permanent-fields/permanent-fields";
import ProfilePage from "@pages/profile/profile";
import RecordPage from "@pages/record/record";
import { ResetPassword } from "@pages/reset-password/resetPassword";
import SupportPage from "@pages/support/support";
import UserPage from "@pages/user/user";
import { UsersPage } from "@pages/users/users";
import { WithdrawalsPage } from "@pages/withdrawals/withdrawals";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
    return (
        <div className="container">
            <Routes>
                <Route
                    path={PATHS.AUTH}
                    element={
                        <AuthLayout>
                            <Auth />
                        </AuthLayout>
                    }
                />
                <Route
                    path={PATHS.SECRET_AUTH}
                    element={
                        <AuthLayout>
                            <Auth />
                        </AuthLayout>
                    }
                />
                <Route
                    path={PATHS.RESET_PASSWORD}
                    element={
                        <AuthLayout>
                            <ResetPassword />
                        </AuthLayout>
                    }
                />
                <Route element={<PrivateOutlet />}>
                    <Route
                        path={PATHS.FAQ}
                        element={
                            <MainLayout>
                                <FaqPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.SUPPORT}
                        element={
                            <MainLayout>
                                <SupportPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.ADMIN}
                        element={
                            <MainLayout>
                                <AdminPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.HOME}
                        element={
                            <MainLayout>
                                <HomePage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.WITHDRAWALS}
                        element={
                            <MainLayout>
                                <WithdrawalsPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.PROFILE}
                        element={
                            <MainLayout>
                                <ProfilePage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.PERMANENT_FIELDS}
                        element={
                            <MainLayout>
                                <PermanentFieldsPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.EMPLOYEES}
                        element={
                            <MainLayout>
                                <EmployeesPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.USERS}
                        element={
                            <MainLayout>
                                <UsersPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.USER}
                        element={
                            <MainLayout>
                                <UserPage />
                            </MainLayout>
                        }
                    >
                        <Route
                            path=":id"
                            element={
                                <MainLayout>
                                    <UserPage />
                                </MainLayout>
                            }
                        />
                    </Route>
                    <Route
                        path={PATHS.BOT_OWNERS}
                        element={
                            <MainLayout>
                                <BotOwnersPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.NOTIFICATIONS}
                        element={
                            <MainLayout>
                                <NotificationsPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path={PATHS.RECORD}
                        element={
                            <MainLayout>
                                <RecordPage />
                            </MainLayout>
                        }
                    >
                        <Route
                            path=":id"
                            element={
                                <MainLayout>
                                    <RecordPage />
                                </MainLayout>
                            }
                        />
                    </Route>
                    <Route
                        path={PATHS.EMPLOYEE}
                        element={
                            <MainLayout>
                                <EmployeePage />
                            </MainLayout>
                        }
                    >
                        <Route
                            path=":id"
                            element={
                                <MainLayout>
                                    <EmployeePage />
                                </MainLayout>
                            }
                        />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}
