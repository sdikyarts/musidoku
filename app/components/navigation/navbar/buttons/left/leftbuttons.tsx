'use client';

import React from "react";
import { usePathname } from "next/navigation";
import Button from "../../../../button";

const LeftNavbarButtonsMenu: React.FC = () => {
    const pathname = usePathname();
    
    return (
        <div style={{
            display: "flex",
            alignItems: "flex-start"
        }}>
            <Button 
                href="/artists" 
                text="Artists Roster" 
                size="medium" 
                variant="ghost"
                isActive={pathname.startsWith('/artists')}
            />
            <Button 
                href="/about" 
                text="How To Play?" 
                size="medium" 
                variant="ghost"
                isActive={pathname.startsWith('/about')}
            />
        </div>
    );
};

export default LeftNavbarButtonsMenu;