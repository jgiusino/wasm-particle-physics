import * as wasm from "wasm-particle-physics";
import { memory } from "wasm-particle-physics/wasm_particle_physics_bg"

import * as THREE from "./js/three.module.js";

const simulation = wasm.Simulation.new();
const particleCount = simulation.particle_count();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.SphereGeometry(0.25,8,8);
var material = new THREE.MeshNormalMaterial();

var particleMesh = new THREE.Mesh( geometry, material );
var meshArray = [];

for (let index = 0; index < particleCount; index++) {
    meshArray.push(particleMesh.clone());
};

meshArray.forEach( mesh => scene.add( mesh ));

camera.position.z = 100;
camera.position.x = 50;
camera.position.y = 1;

var particlesPtr = simulation.particles();
var particles = new Float32Array(memory.buffer, particlesPtr, particleCount*6);

function animate() {
    requestAnimationFrame( animate );
    simulation.tick(0.1);
    simulation.check_collision();
    for (let index = 0; index < meshArray.length; index++) {
        var j = index * 6;
        var mesh = meshArray[index];
        mesh.position.set(
            particles[j],
            particles[j + 1],
            particles[j + 2],
        );
    }
    renderer.render( scene, camera );
}

animate();