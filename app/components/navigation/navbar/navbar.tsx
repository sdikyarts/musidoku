'use client';

import React, { useEffect, useState } from "react";
import LeftNavbarButtons from "./buttons/left";
import RightNavbarButtons from "./buttons/right";
import { calculateNavbarHorizontalPadding } from "@/lib/layout/padding";
import MenuIcon from "../../icons/MenuIcon";
import Logo from "../../logo";
import Button from "../../button";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
    const [padding, setPadding] = useState(96);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(1024);
    const pathname = usePathname();

    useEffect(() => {
        const updatePadding = () => {
            const newPadding = calculateNavbarHorizontalPadding();
            setPadding(newPadding);
            
            if (globalThis.window !== undefined) {
                setScreenWidth(globalThis.window.innerWidth);
            }
        };

        updatePadding();
        globalThis.window.addEventListener('resize', updatePadding);
        return () => globalThis.window.removeEventListener('resize', updatePadding);
    }, []);

    const isMobile = screenWidth < 799;

    return (
        <>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: "flex",
                width: "100%",
                height: "64px",
                overflow: "hidden",
                padding: `17px ${padding}px`,
                background: "#F3FDFB",
                justifyContent: "space-between",
                alignItems: "center",
                boxSizing: "border-box"
            }}>
                {isMobile ? (
                    <>
                        <Logo />
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "36px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                background: "transparent",
                                cursor: "pointer",
                            }}
                        >
                            <MenuIcon color="#404B49" size={24} />
                        </button>
                    </>
                ) : (
                    <>
                        <LeftNavbarButtons />
                        <RightNavbarButtons />
                    </>
                )}
            </div>
            
            {/* Mobile Menu Overlay */}
            {isMobile && isMobileMenuOpen && (
                <>
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 99,
                        }}
                    />
                    <div
                        style={{
                            position: "fixed",
                            top: "64px",
                            left: 0,
                            right: 0,
                            background: "#F3FDFB",
                            zIndex: 101,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{
                            padding: `16px ${padding}px 16px ${padding}px`,
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}>
                            <div style={{ padding: 0 }}>
                                <Button 
                                    href="/artists" 
                                    text="Artists Roster" 
                                    size="medium" 
                                    variant="ghost"
                                    isActive={pathname.startsWith('/artists')}
                                    noPadding={true}
                                />
                            </div>
                            <div style={{ padding: 0 }}>
                                <Button 
                                    href="/about" 
                                    text="How To Play?" 
                                    size="medium" 
                                    variant="ghost"
                                    isActive={pathname.startsWith('/about')}
                                    noPadding={true}
                                />
                            </div>
                        </div>
                        <div style={{ 
                            paddingLeft: `${padding}px`,
                            paddingRight: `${padding}px`,
                        }}>
                            <div style={{ 
                                width: "100%", 
                                height: "1px", 
                                background: "#d1d5db",
                            }} />
                        </div>
                        <div style={{
                            padding: `16px ${padding}px 24px ${padding}px`,
                        }}>
                            <Button href="/login" text="Log In" size="medium" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
