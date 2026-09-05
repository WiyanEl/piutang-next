import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/server";
import type { ApiError, ApiSuccess, Debt } from "@/app/types/debt";
import { createDebtSchema, debtQuerySchema } from "@/app/lib/validations/debt";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    const query = debtQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });

    if (!query.success) {
      const response: ApiError = {
        success: false,
        message: "Parameter filter tidak valid",
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }

    const { status, type } = query.data;

    let queryBuilder = supabase
      .from("debts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (type) {
      queryBuilder = queryBuilder.eq("type", type);
    }

    if (status === "settled") {
      queryBuilder = queryBuilder.not(
        "settled_at",
        "is",
        null,
      );
    }

    if (status === "unsettled") {
      queryBuilder = queryBuilder.is(
        "settled_at",
        null,
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("GET /api/debts:", error);

      const response: ApiError = {
        success: false,
        message: "Gagal mengambil data kasbon",
      };

      return NextResponse.json(response, {
        status: 500,
      });
    }

    const response: ApiSuccess<Debt[]> = {
      success: true,
      data: data as Debt[],
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/debts unexpected error:", error);

    const response: ApiError = {
      success: false,
      message: "Terjadi kesalahan pada server",
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const validation = createDebtSchema.safeParse(body);

    if (!validation.success) {
      const response: ApiError = {
        success: false,
        message: "Data kasbon tidak valid",
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }

    const { type, counterpart_name, amount, note, due_date } =
      validation.data;

    const { data, error } = await supabase
      .from("debts")
      .insert({
        user_id: user.id,
        type,
        counterpart_name,
        amount,
        note: note ?? null,
        due_date: due_date ?? null,
        settled_at: null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/debts:", error);

      const response: ApiError = {
        success: false,
        message: "Gagal menambahkan kasbon",
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
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/debts unexpected error:", error);

    const response: ApiError = {
      success: false,
      message: "Terjadi kesalahan pada server",
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}