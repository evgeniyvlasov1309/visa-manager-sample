import { useAuthStore } from "@pages/auth/store";
import { countries } from "@shared/components/filters/CountryFilter/countries";
import { Button } from "@shared/components/ui/Button/Button";
import { Select } from "@shared/components/ui/Select/Select";
import Table from "@shared/components/ui/Table/Table";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AdminService from "./admin-service";
import { useAdminStore } from "./store";
import { columns } from "./table-columns";
import type { Bot, BotRequest } from "./types";

export default function AdminPage() {
    const [user] = useAuthStore((state) => [state.user]);
    const [loading, getBots, bots] = useAdminStore((state) => [
        state.loading,
        state.getBots,
        state.bots,
    ]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<BotRequest>();

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/");
        } else {
            getBots();
        }
    }, []);

    async function onSubmit(data: BotRequest) {
        try {
            await AdminService.createBot(data);
            alert("Бот создан");
        } catch (error) {
            alert(error);
        }
    }

    return (
        <WithLoading loading={loading}>
            <>
                <Table<Bot>
                    columns={columns()}
                    data={bots.map((item) => ({
                        ...item,
                        group: false,
                        groupFirstEl: false,
                    }))}
                    loading={loading}
                    onBottomReached={() => ({})}
                />
                <form className="bot-form" onSubmit={handleSubmit(onSubmit)}>
                    <Select
                        items={countries}
                        {...register("country")}
                        errorMessage={errors.country?.message as string}
                        label="Страна"
                        placeholder="Выберите страну"
                    />
                    <Button
                        title="Создать бота"
                        type="submit"
                        disabled={!isValid}
                        dense
                    />
                </form>
            </>
        </WithLoading>
    );
}
