import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { itemTitle, userEmail, notes } = await request.json();
    const supabase = await createClient();

    // Insert into DB
    const { error } = await supabase.from('inquiries').insert({
      item_title: itemTitle,
      user_email: userEmail,
      notes: notes,
      status: 'pending'
    });

    if (error) {
      console.error('Error inserting inquiry:', error);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

