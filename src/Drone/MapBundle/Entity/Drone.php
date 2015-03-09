<?php

namespace Drone\MapBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * Drone
 *
 * @ORM\Table()
 * @ORM\Entity
 *
 * @ExclusionPolicy("all")
 */
class Drone
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Expose
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="product", type="string", length=255)
     * @Expose
     */
    private $product;

    /**
     * @var string
     *
     * @ORM\Column(name="serial_number", type="string", length=255)
     * @Expose
     */
    private $serialNumber;

    /**
     * @var float
     *
     * @ORM\Column(name="latitude", type="float")
     */
    private $latitude;

    /**
     * @var float
     *
     * @ORM\Column(name="longitude", type="float")
     */
    private $longitude;

    /**
     * @ORM\ManyToOne(targetEntity="Drone\UserBundle\Entity\User", inversedBy="drones")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true)
     **/
    private $user;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set product
     *
     * @param string $product
     * @return Drone
     */
    public function setProduct($product)
    {
        $this->product = $product;

        return $this;
    }

    /**
     * Get product
     *
     * @return string 
     */
    public function getProduct()
    {
        return $this->product;
    }

    /**
     * Set serialNumber
     *
     * @param string $serialNumber
     * @return Drone
     */
    public function setSerialNumber($serialNumber)
    {
        $this->serialNumber = $serialNumber;

        return $this;
    }

    /**
     * Get serialNumber
     *
     * @return string 
     */
    public function getSerialNumber()
    {
        return $this->serialNumber;
    }

    /**
     * Set latitude
     *
     * @param float $latitude
     * @return Drone
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return float 
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set longitude
     *
     * @param float $longitude
     * @return Drone
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return float 
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * Get the localisation
     * 
     * @return String
     * @VirtualProperty 
     */
    public function getLocation(){
        return array("lon" => $this->getLongitude(), "lat" => $this->getLatitude());
    }

    /**
     * Set user
     *
     * @param \Drone\UserBundle\Entity\User $user
     * @return Drone
     */
    public function setUser(\Drone\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;
        
        return $this;
    }

    /**
     * Get user
     *
     * @return \Drone\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
}
