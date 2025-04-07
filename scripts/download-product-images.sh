#!/bin/bash

# Create assets directory if it doesn't exist
mkdir -p ecommerce_app/public/images/images

# Download product images
curl -o ecommerce_app/public/images/images/headphones.jpg https://images.unsplash.com/photo-1505740420928-5e560c06d30e
curl -o ecommerce_app/public/images/images/smartwatch.jpg https://images.unsplash.com/photo-1523275335684-37898b6baf30
curl -o ecommerce_app/public/images/images/backpack.jpg https://images.unsplash.com/photo-1553062407-98eeb64c6a62
curl -o ecommerce_app/public/images/images/mouse.jpg https://images.unsplash.com/photo-1527814050087-3793815479db
curl -o ecommerce_app/public/images/images/keyboard.jpg https://images.unsplash.com/photo-1587829741301-dc798b83add3
curl -o ecommerce_app/public/images/images/mousepad.jpg https://images.unsplash.com/photo-1592155931584-901ac15763e3
curl -o ecommerce_app/public/images/images/usbhub.jpg https://images.unsplash.com/photo-1593642632823-8f785ba67e45
curl -o ecommerce_app/public/images/images/speaker.jpg https://images.unsplash.com/photo-1606220588911-5117e479d3a1
curl -o ecommerce_app/public/images/images/laptopstand.jpg https://images.unsplash.com/photo-1517336714731-489689fd1ca8
curl -o ecommerce_app/public/images/images/webcam.jpg https://images.unsplash.com/photo-1516035069371-29a1b244cc32

echo "Product images downloaded successfully!" 