import React from 'react';

export const RestaurantCardSkeleton = () => {
    return (
        <div className="rounded-2xl overflow-hidden hover-card animate-pulse">
            <div className="h-48 w-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-4 bg-white dark:bg-slate-800 h-32">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 mb-3"></div>
                <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4"></div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
            </div>
        </div>
    );
};

export const MenuItemSkeleton = () => {
    return (
        <div className="flex justify-between items-start gap-4 p-4 mb-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
                </div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4 mb-3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-full mb-1"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6"></div>
            </div>
            <div className="relative flex flex-col items-center">
                <div className="w-28 h-28 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4"></div>
                <div className="absolute -bottom-3 w-24 h-8 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
            </div>
        </div>
    );
};
