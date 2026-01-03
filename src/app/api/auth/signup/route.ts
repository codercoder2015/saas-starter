import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, createServerClient, createSupabaseAdminClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// 强制动态渲染，因为使用了外部服务
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const adminClient = createSupabaseAdminClient()
    const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const anonClient = (anonUrl && anonKey) ? createClient(anonUrl, anonKey) : null

    let data: { user: any; session: any } = { user: null, session: null }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      })
      if (adminError) {
        const msg = adminError.message || ''
        if (msg.includes('Bearer') || msg.toLowerCase().includes('api key')) {
          if (!anonClient) {
            return NextResponse.json(
              { error: 'Supabase anon key not configured' },
              { status: 500 }
            )
          }
          const { data: signUpData, error: signUpError } = await anonClient.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
          if (signUpError) {
            const signUpMsg = signUpError.message || ''
            if (signUpMsg.toLowerCase().includes('already')) {
              const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
                email,
                password,
              })
              if (!signInError) {
                data.user = signInData.user
                data.session = signInData.session
              } else {
                return NextResponse.json(
                  { error: signUpError.message },
                  { status: 400 }
                )
              }
            } else {
              return NextResponse.json(
                { error: signUpError.message },
                { status: 400 }
              )
            }
          } else {
            data = signUpData as any
          }
        } else {
          return NextResponse.json(
            { error: adminError.message },
            { status: 400 }
          )
        }
      } else {
        data.user = adminData.user
      }
    } else {
      if (!anonClient) {
        return NextResponse.json(
          { error: 'Supabase anon key not configured' },
          { status: 500 }
        )
      }
      const { data: signUpData, error: signUpError } = await anonClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (signUpError) {
        const signUpMsg = signUpError.message || ''
        if (signUpMsg.toLowerCase().includes('already')) {
          const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
            email,
            password,
          })
          if (!signInError) {
            data.user = signInData.user
            data.session = signInData.session
          } else {
            return NextResponse.json(
              { error: signUpError.message },
              { status: 400 }
            )
          }
        } else {
          return NextResponse.json(
            { error: signUpError.message },
            { status: 400 }
          )
        }
      } else {
        data = signUpData as any
      }
    }

    let customer
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        customer = await createOrRetrieveCustomer({
          uuid: data.user?.id || '',
          email: email,
        }).catch((err: any) => {
          throw err
        })
      } catch (err: any) {
        console.error('Stripe customer setup failed, continue signup:', err?.message || err)
        // 不阻断注册流程，继续后续逻辑
      }
    }

    // 添加注册奖励积分
    if (data.user?.id) {
      try {
        const timestamp = Date.now()
        const userId = data.user.id
        const trans_no = `SIGNUP_BONUS_${timestamp}_${userId.substring(0, 8)}`
        
        const { error: creditError } = await adminClient
          .from('credits')
          .insert({
            trans_no: trans_no,
            user_id: userId,
            trans_type: 'signup_bonus',
            credits: 50,
            description: '新用户注册奖励积分'
          })

        if (creditError) {
          console.error('Failed to add signup bonus credits:', creditError)
          // 积分添加失败不影响注册流程
        } else {
          console.log('✅ Signup bonus credits added for user:', userId)
        }
      } catch (creditErr) {
        console.error('Error adding signup bonus:', creditErr)
        // 积分添加异常不影响注册流程
      }
    }

     // 注册成功后，直接登录用户以获取 session
     let sessionData = data.session
     if (!sessionData && data.user) {
       // 如果 signUp 没有返回 session，直接用密码登录
       const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
         email,
         password,
       })
       
       if (signInError) {
         console.warn('Failed to auto-login after signup:', signInError)
         // 登录失败不影响注册流程，用户可以手动登录
       } else {
         sessionData = signInData.session
       }
     }

    // 创建响应并设置 Supabase 会话 Cookie
    const response = NextResponse.json({
      user: data.user,
      session: sessionData,
      message: 'Account created successfully!'
    })

    // 如果有 session，设置 Cookie 以保持登录状态
    if (sessionData) {
      response.cookies.set('auth-token', JSON.stringify({ 
        access_token: sessionData.access_token, 
        refresh_token: sessionData.refresh_token 
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }
    

    return response

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
