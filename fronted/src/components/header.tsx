'use client'

import { Dog } from "lucide-react"
import Link from "next/link"

export function HeaderComponent() {
  return (
    <header className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Dog className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">狗科艦</h1>
              <p className="text-sm font-medium">您的狗品種鑑識專家</p>
            </div>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
              <li><Link href="/" className="hover:underline">首頁</Link></li>
              <li><Link href="/identify" className="hover:underline">品種鑑定</Link></li>
              <li><Link href="/breeds" className="hover:underline">品種圖鑑</Link></li>
              <li><Link href="/about" className="hover:underline">關於我們</Link></li>
              <li><Link href="/contact" className="hover:underline">聯絡我們</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}