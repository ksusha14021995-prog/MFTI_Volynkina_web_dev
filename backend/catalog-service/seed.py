"""Seed script for catalog-service.

Run inside the container:
    docker exec catalog-service python seed.py

Idempotent: skips if countries table already has rows.
"""

import sys

from app.db import SessionLocal, engine
from app.models import Base, Brand, Country, Product, ProductVariant

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(Country).count() > 0:
    print("Seed already applied. Skipping.")
    db.close()
    sys.exit(0)

# --- Countries ---

countries_data = [
    {"name": "США", "code": "US"},
    {"name": "Франция", "code": "FR"},
    {"name": "Великобритания", "code": "GB"},
    {"name": "Швеция", "code": "SE"},
    {"name": "Оман", "code": "OM"},
]

countries = {}
for c in countries_data:
    country = Country(name=c["name"], code=c["code"])
    db.add(country)
    db.flush()
    countries[c["code"]] = country

# --- Brands ---

brands_data = [
    {"name": "Tom Ford", "slug": "tom-ford", "country_code": "US"},
    {"name": "Yves Saint Laurent", "slug": "yves-saint-laurent", "country_code": "FR"},
    {"name": "Maison Margiela", "slug": "maison-margiela", "country_code": "FR"},
    {"name": "Creed", "slug": "creed", "country_code": "GB"},
    {"name": "Byredo", "slug": "byredo", "country_code": "SE"},
    {"name": "Le Labo", "slug": "le-labo", "country_code": "US"},
    {"name": "Amouage", "slug": "amouage", "country_code": "OM"},
]

brands = {}
for b in brands_data:
    brand = Brand(name=b["name"], slug=b["slug"], country_id=countries[b["country_code"]].id)
    db.add(brand)
    db.flush()
    brands[b["slug"]] = brand

# --- Products with variants ---

products_data = [
    # Tom Ford
    {
        "brand_slug": "tom-ford",
        "name": "Tom Ford Black Orchid",
        "slug": "tom-ford-black-orchid",
        "description": "Роскошный восточный аромат с нотами черного трюфеля, иланг-иланга и пачули. Один из самых культовых ароматов Tom Ford.",
        "gender": "unisex",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "750.00", "stock_quantity": 15},
            {"volume_ml": 10, "price": "1400.00", "stock_quantity": 10},
            {"volume_ml": 30, "price": "3800.00", "stock_quantity": 7},
        ],
    },
    {
        "brand_slug": "tom-ford",
        "name": "Tom Ford Tobacco Vanille",
        "slug": "tom-ford-tobacco-vanille",
        "description": "Теплый и чувственный аромат с нотами табака, ванили, специй и сушеных фруктов.",
        "gender": "unisex",
        "is_hit": True,
        "discount_percent": 5,
        "variants": [
            {"volume_ml": 5, "price": "800.00", "stock_quantity": 12},
            {"volume_ml": 10, "price": "1500.00", "stock_quantity": 8},
            {"volume_ml": 30, "price": "4200.00", "stock_quantity": 5},
        ],
    },
    {
        "brand_slug": "tom-ford",
        "name": "Tom Ford Oud Wood",
        "slug": "tom-ford-oud-wood",
        "description": "Утонченный уд с нотами розового перца, кардамона и сандала. Символ роскоши и сдержанности.",
        "gender": "unisex",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "780.00", "stock_quantity": 10},
            {"volume_ml": 10, "price": "1450.00", "stock_quantity": 6},
            {"volume_ml": 30, "price": "4000.00", "stock_quantity": 4},
        ],
    },
    # YSL
    {
        "brand_slug": "yves-saint-laurent",
        "name": "YSL Black Opium",
        "slug": "ysl-black-opium",
        "description": "Дерзкий женский аромат с нотами кофе, белых цветов и ванили. Современная классика YSL.",
        "gender": "female",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "600.00", "stock_quantity": 20},
            {"volume_ml": 10, "price": "1100.00", "stock_quantity": 15},
            {"volume_ml": 30, "price": "2800.00", "stock_quantity": 10},
        ],
    },
    {
        "brand_slug": "yves-saint-laurent",
        "name": "YSL Y Eau de Parfum",
        "slug": "ysl-y-eau-de-parfum",
        "description": "Мужественный свежий аромат с нотами яблока, имбиря, шалфея и кедра.",
        "gender": "male",
        "is_hit": False,
        "discount_percent": 10,
        "variants": [
            {"volume_ml": 5, "price": "550.00", "stock_quantity": 18},
            {"volume_ml": 10, "price": "1000.00", "stock_quantity": 12},
            {"volume_ml": 30, "price": "2600.00", "stock_quantity": 8},
        ],
    },
    # Maison Margiela
    {
        "brand_slug": "maison-margiela",
        "name": "Replica Beach Walk",
        "slug": "replica-beach-walk",
        "description": "Воспоминание о прогулке по пляжу: ноты бергамота, кокоса и мускуса.",
        "gender": "unisex",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "650.00", "stock_quantity": 14},
            {"volume_ml": 10, "price": "1200.00", "stock_quantity": 9},
            {"volume_ml": 30, "price": "3100.00", "stock_quantity": 6},
        ],
    },
    {
        "brand_slug": "maison-margiela",
        "name": "Replica Jazz Club",
        "slug": "replica-jazz-club",
        "description": "Атмосфера джаз-клуба в аромате: ноты рома, листьев табака и ветивера.",
        "gender": "unisex",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "620.00", "stock_quantity": 16},
            {"volume_ml": 10, "price": "1150.00", "stock_quantity": 11},
            {"volume_ml": 30, "price": "2950.00", "stock_quantity": 7},
        ],
    },
    # Creed
    {
        "brand_slug": "creed",
        "name": "Creed Aventus",
        "slug": "creed-aventus",
        "description": "Легендарный мужской аромат с нотами ананаса, смородины, берёзы и дубового мха.",
        "gender": "male",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "750.00", "stock_quantity": 10},
            {"volume_ml": 10, "price": "1400.00", "stock_quantity": 7},
            {"volume_ml": 30, "price": "4500.00", "stock_quantity": 5},
        ],
    },
    {
        "brand_slug": "creed",
        "name": "Creed Silver Mountain Water",
        "slug": "creed-silver-mountain-water",
        "description": "Свежий и чистый аромат, вдохновлённый горными ручьями: ноты чая, бергамота и мускуса.",
        "gender": "unisex",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "700.00", "stock_quantity": 8},
            {"volume_ml": 10, "price": "1300.00", "stock_quantity": 5},
            {"volume_ml": 30, "price": "4100.00", "stock_quantity": 3},
        ],
    },
    # Byredo
    {
        "brand_slug": "byredo",
        "name": "Byredo Gypsy Water",
        "slug": "byredo-gypsy-water",
        "description": "Аромат свободы и приключений: бергамот, можжевельник, ваниль и сандал.",
        "gender": "unisex",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "680.00", "stock_quantity": 12},
            {"volume_ml": 10, "price": "1250.00", "stock_quantity": 8},
            {"volume_ml": 30, "price": "3300.00", "stock_quantity": 6},
        ],
    },
    {
        "brand_slug": "byredo",
        "name": "Byredo Bal d'Afrique",
        "slug": "byredo-bal-dafrique",
        "description": "Африканский бал в аромате: африканские цветы, бергамот, нероли и ветивер.",
        "gender": "unisex",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "660.00", "stock_quantity": 10},
            {"volume_ml": 10, "price": "1220.00", "stock_quantity": 7},
            {"volume_ml": 30, "price": "3200.00", "stock_quantity": 5},
        ],
    },
    # Le Labo
    {
        "brand_slug": "le-labo",
        "name": "Le Labo Santal 33",
        "slug": "le-labo-santal-33",
        "description": "Культовый аромат с нотами сандала, кедра, кардамона и фиалки. Один из самых узнаваемых нишевых ароматов.",
        "gender": "unisex",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "780.00", "stock_quantity": 13},
            {"volume_ml": 10, "price": "1480.00", "stock_quantity": 9},
            {"volume_ml": 30, "price": "4300.00", "stock_quantity": 5},
        ],
    },
    {
        "brand_slug": "le-labo",
        "name": "Le Labo Rose 31",
        "slug": "le-labo-rose-31",
        "description": "Роза в мужском прочтении: 31 ингредиент, включая розу, кумин, уд и кедр.",
        "gender": "unisex",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "720.00", "stock_quantity": 11},
            {"volume_ml": 10, "price": "1350.00", "stock_quantity": 7},
            {"volume_ml": 30, "price": "3900.00", "stock_quantity": 4},
        ],
    },
    # Amouage
    {
        "brand_slug": "amouage",
        "name": "Amouage Interlude Man",
        "slug": "amouage-interlude-man",
        "description": "Мощный ориентальный аромат с нотами ладана, уда, бурбонского перца и янтаря.",
        "gender": "male",
        "is_hit": True,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "800.00", "stock_quantity": 9},
            {"volume_ml": 10, "price": "1500.00", "stock_quantity": 6},
            {"volume_ml": 30, "price": "4500.00", "stock_quantity": 4},
        ],
    },
    {
        "brand_slug": "amouage",
        "name": "Amouage Honour Woman",
        "slug": "amouage-honour-woman",
        "description": "Элегантный женский аромат с нотами туберозы, иланг-иланга, сандала и мускуса.",
        "gender": "female",
        "is_hit": False,
        "discount_percent": 0,
        "variants": [
            {"volume_ml": 5, "price": "790.00", "stock_quantity": 8},
            {"volume_ml": 10, "price": "1480.00", "stock_quantity": 5},
            {"volume_ml": 30, "price": "4400.00", "stock_quantity": 3},
        ],
    },
]

for p_data in products_data:
    brand = brands[p_data["brand_slug"]]
    product = Product(
        brand_id=brand.id,
        name=p_data["name"],
        slug=p_data["slug"],
        description=p_data["description"],
        gender=p_data["gender"],
        is_hit=p_data["is_hit"],
        discount_percent=p_data["discount_percent"],
        is_active=True,
    )
    db.add(product)
    db.flush()

    for v_data in p_data["variants"]:
        variant = ProductVariant(
            product_id=product.id,
            volume_ml=v_data["volume_ml"],
            price=v_data["price"],
            stock_quantity=v_data["stock_quantity"],
        )
        db.add(variant)

db.commit()
print(f"Seeded {len(products_data)} products across {len(brands_data)} brands in {len(countries_data)} countries.")
db.close()
