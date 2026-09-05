import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/server";
import type { ApiError, ApiSuccess, Debt } from "@/app/types/debt";
import { updateDebtSchema } from "@/app/lib/validations/debt";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const response: ApiError = {
        success: false,
        message: "Anda harus login terlebih dahulu",
      };

      return NextResponse.json(response, {
        status: 401,
      });
    }

    const { id } = await params;

    const body = await request.json();

    const validation = updateDebtSchema.safeParse(body);

    if (!validation.success) {
      const response: ApiError = {
        success: false,
        message: "Data kasbon tidak valid",
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }

    const updateData = validation.data;

    const { data, error } = await supabase
      .from("debts")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("PATCH /api/debts/[id]:", error);

      const response: ApiError = {
        success: false,
        message: "Gagal memperbarui kasbon",
      };

      return NextResponse.json(response, {
        status: 500,
      });
    }

    const response: ApiSuccess<Debt> = {
      success: true,
      data: data as Debt,
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("PATCH /api/debts/[id] unexpected error:", error);

    const response: ApiError = {
      success: false,
      message: "Terjadi kesalahan pada server",
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const response: ApiError = {
        success: false,
        message: "Anda harus login terlebih dahulu",
      };

      return NextResponse.json(response, {
        status: 401,
      });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("DELETE /api/debts/[id]:", error);

      const response: ApiError = {
        success: false,
        message: "Gagal menghapus kasbon",
      };

      return NextResponse.json(response, {
        status: 500,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/debts/[id] unexpected error:", error);

    const response: ApiError = {
      success: false,
      message: "Terjadi kesalahan pada server",
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}