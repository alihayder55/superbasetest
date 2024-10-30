import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxzasnsucksdzwdmatzt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14emFzbnN1Y2tzZHp3ZG1hdHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMzA3NzksImV4cCI6MjA0NTgwNjc3OX0.NDEe2XncnTqNi8ApPwICF98pAcVAre8eCytiFdZ4fYo'; // استبدل بمفتاح الأنون الخاص بك
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const insertApartment = async(apartmentData) => {
    const { data, error } = await supabase
        .from('apartments')
        .insert([apartmentData]);

    if (error) {
        throw error;
    }
    return data;
};