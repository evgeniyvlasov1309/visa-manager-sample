import { Loader } from "@shared/components/ui/Loader/Loader";
import { getClassName } from "@shared/utilities/getClassName";
import React from "react";
import "./Table.scss";

export interface TableColumn<T> {
    field: keyof T;
    label: string;
    width: string;
    render?: (data: T) => JSX.Element | string;
    renderHeader?: () => JSX.Element | string;
    visible?: boolean;
    defaultValue?: string;
    className?: string;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    loading: boolean;
    onBottomReached: () => void;
    onRowClick?: (
        value: T,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
    placeholder?: string;
}

export default function Table<
    T extends { id: number; group?: boolean; groupFirstEl?: boolean }
>(props: TableProps<T>) {
    const {
        columns,
        data,
        loading,
        onRowClick,
        onBottomReached,
        placeholder = `На данный момент не добавлено ни одной записи на
    подачу документов в визовый центр. Добавьте первого
    заявителя для начала работы`,
    } = props;

    const handleScroll = ({ target }: any) => {
        if (
            target.scrollTop + target.clientHeight >=
            target.scrollHeight - 100
        ) {
            onBottomReached();
        }
    };

    const columnsSize = columns
        .filter((column) => column.visible !== false)
        .map((column) => `${column.width}`)
        .join(" ");

    let isEven = true;

    return !loading ? (
        <div className="table" onScroll={handleScroll}>
            <div className="table__inner">
                <div
                    className="table__header"
                    style={{ gridTemplateColumns: columnsSize }}
                >
                    {columns.map((column) => (
                        <div
                            hidden={column.visible === false}
                            className={getClassName([
                                `table__th`,
                                column.className,
                            ])}
                            key={column.field as string}
                        >
                            {column.renderHeader?.() || column.label}
                        </div>
                    ))}
                </div>
                <div className="table__body">
                    {data.length ? (
                        data.map((item, index) => {
                            if (item.groupFirstEl || !item.group) {
                                isEven = !isEven;
                            }

                            return (
                                <div
                                    className={getClassName([
                                        `table__row`,
                                        onRowClick
                                            ? "table__row--clickable"
                                            : "",
                                        item.group ? `table__row--group` : "",
                                        item.group && isEven
                                            ? `table__row--group-even`
                                            : "",
                                    ])}
                                    onClick={(e) => onRowClick?.(item, e)}
                                    style={{ gridTemplateColumns: columnsSize }}
                                    key={index}
                                >
                                    {columns.map((column) => (
                                        <div
                                            className={getClassName([
                                                `table__td`,
                                                column.className,
                                            ])}
                                            hidden={column.visible === false}
                                            key={column.field as string}
                                        >
                                            {column.render?.(item) ||
                                                (item[
                                                    column.field
                                                ] as string) ||
                                                column.defaultValue}
                                        </div>
                                    ))}
                                </div>
                            );
                        })
                    ) : (
                        <div className="table__no-data-label">
                            {placeholder}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className="table__loader">
            <Loader />
        </div>
    );
}
