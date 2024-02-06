'use client'

import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Replace SUPABASE_KEY with the actual environment variable name
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Replace SUPABASE_URL with the actual environment variable name
const supabase = createClient(supabaseUrl!, supabaseKey!);

const lightColors = ["#FFCCCC", "#FFDDCC", "#FFEECC", "#FFFFCC", "#EEFFCC", "#DDFFCC", "#CCFFCC", "#CCFFDD", "#CCFFEE", "#CCFFFF", "#CCEEFF", "#CCDDFF", "#CCCCFF", "#DDCCFF", "#EECCFF", "#FFCCFF"]; // Define the 16 light colors


export default function GameField() {
    const [gameFields, setGameFields] = useState<Array<{ owner: any, id : any, color : any }>>([]); // Update the type of gameFields
    const [nameValue, setNameValue] = useState(""); // Add nameValue variable
    const nameHashColor = (name: string): string => {
        const nameNotNull = name || "Anonymous";
        const hash = nameNotNull
            .split('')
            .reduce((acc, char) => {
                acc = ((acc << 5) - acc) + char.charCodeAt(0);
                return acc & acc;
            }, 0);

        const index = Math.abs(hash) % lightColors.length;
        return lightColors[index];
    };

    useEffect(() => {
        const fetchGameFields = async () => {
            try {
                const { data, error } = await supabase
                    .from("game_fields")
                    .select("id,owner")
                    .range(0, 12)
                    .order("id", { ascending: true });

                if (error) {
                    throw new Error(error.message);
                }

                setGameFields(data.map((gameField: { owner: any, id: any }) => ({
                    ...gameField,
                    color: nameHashColor(gameField.owner) // Add color property with nameHashColor value
                })));
            } catch (error) {
                console.error("Error fetching game fields:", error);
            }
        };

        fetchGameFields();
    }, []);

    return (
        <div>
            <div>
                <label htmlFor="name" className="ml-2">Name:</label>
                <input
                    type="text"
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="name"
                    id="name"
                    value={nameValue} // Add nameValue variable
                    className='border-2 border-gray-500 rounded-md p-2 w-1/4 ml-2'
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: "10px", height: "80vh", width: "100vw" }}>
                {gameFields.map((gameField, index) => (
                    <div key={index} style={{ border: "1px solid black", background: gameField.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {gameField.owner} {gameField.id}
                    </div>
                ))}
            </div>
        </div>
    )
}
